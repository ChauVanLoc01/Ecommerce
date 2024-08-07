import { PrismaService } from '@app/common/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { format } from 'date-fns'
import { Request, Response } from 'express'
import { CreatePaymentDTO } from '../dtos/payment.dto'

@Injectable()
export class PaymentService {
    constructor(
        private readonly config: ConfigService,
        private readonly prisma: PrismaService
    ) {}

    sortObject(obj: Object) {
        let sorted = {}
        let str = []
        let key
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                str.push(encodeURIComponent(key))
            }
        }
        str.sort()
        for (key = 0; key < str.length; key++) {
            sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+')
        }
        return sorted
    }

    async createTransaction(req: Request, res: Response, body: CreatePaymentDTO) {
        process.env.TZ = 'Asia/Ho_Chi_Minh'

        let date = new Date()
        let createDate = format(date, 'yyyyMMddHHmmss')

        let ipAddr =
            req.headers?.['x-forwarded-for'] ||
            req?.['connection']?.remoteAddress ||
            req?.['socket']?.remoteAddress ||
            req?.['connection']?.['socket'].remoteAddress

        let config = require('config')

        let tmnCode = this.config.get<string>('app.vnp_TmnCode')
        let secretKey = this.config.get<string>('app.vnp_HashSecret')
        let vnpUrl = this.config.get<string>('app.vnp_Url')
        let returnUrl = this.config.get<string>('app.vnp_ReturnUrl')

        let orderId = format(date, 'ddHHmmss')
        let amount = req.body['amount']
        let bankCode = req.body['bankCode']

        let locale = req.body?.['language']
        if (locale === null || locale === '') {
            locale = 'vn'
        }
        let currCode = 'VND'
        let vnp_Params = {}
        vnp_Params['vnp_Version'] = '2.1.0'
        vnp_Params['vnp_Command'] = 'pay'
        vnp_Params['vnp_TmnCode'] = tmnCode
        vnp_Params['vnp_Locale'] = locale
        vnp_Params['vnp_CurrCode'] = currCode
        vnp_Params['vnp_TxnRef'] = orderId
        vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId
        vnp_Params['vnp_OrderType'] = 'other'
        vnp_Params['vnp_Amount'] = amount * 100
        vnp_Params['vnp_ReturnUrl'] = returnUrl
        vnp_Params['vnp_IpAddr'] = ipAddr
        vnp_Params['vnp_CreateDate'] = createDate
        if (bankCode !== null && bankCode !== '') {
            vnp_Params['vnp_BankCode'] = bankCode
        }

        vnp_Params = this.sortObject(vnp_Params)

        let querystring = require('qs')
        let signData = querystring.stringify(vnp_Params, { encode: false })
        let crypto = require('crypto')
        let hmac = crypto.createHmac('sha512', secretKey)
        let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex')
        vnp_Params['vnp_SecureHash'] = signed
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false })

        res.redirect(vnpUrl)
    }
}
