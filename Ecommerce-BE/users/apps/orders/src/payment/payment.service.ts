import { PrismaService } from '@app/common/prisma/prisma.service'
import { Inject, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { format } from 'date-fns'
import { Request, Response } from 'express'
import { CreatePaymentDTO } from '../dtos/payment.dto'
import * as querystring from 'qs'
import { ClientProxy } from '@nestjs/microservices'
import { statusOfTransaction } from 'common/constants/event.constant'
import * as crypto from 'crypto'

@Injectable()
export class PaymentService {
    constructor(
        private readonly configService: ConfigService,
        private readonly prisma: PrismaService,
        @Inject('SOCKET_SERVICE') private socketClient: ClientProxy
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
        let { amount, bankCode, actionId } = body
        process.env.TZ = 'Asia/Ho_Chi_Minh'

        let date = new Date()
        let createDate = format(date, 'yyyyMMddHHmmss')

        let ipAddr =
            req.headers?.['x-forwarded-for'] ||
            req?.['connection']?.remoteAddress ||
            req?.['socket']?.remoteAddress ||
            req?.['connection']?.['socket'].remoteAddress

        let tmnCode = this.configService.get<string>('app.vnp_TmnCode')
        let secretKey = this.configService.get<string>('app.vnp_HashSecret')
        let vnpUrl = this.configService.get<string>('app.vnp_Url')
        let returnUrl = this.configService.get<string>('app.vnp_ReturnUrl')
        console.log('tmnCOde', tmnCode)
        console.log('secretKey', secretKey)
        console.log('vnpUrl', vnpUrl)
        console.log('returnURl', returnUrl)

        let orderId = format(date, 'ddHHmmss')

        let currCode = 'VND'
        let vnp_Params = {}
        vnp_Params['vnp_Version'] = '2.1.0'
        vnp_Params['vnp_Command'] = 'pay'
        vnp_Params['vnp_TmnCode'] = tmnCode
        vnp_Params['vnp_Locale'] = 'vn'
        vnp_Params['vnp_CurrCode'] = currCode
        vnp_Params['vnp_TxnRef'] = orderId
        vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId
        // vnp_Params['vnp_ActionId'] = actionId
        vnp_Params['vnp_OrderType'] = 'other'
        vnp_Params['vnp_Amount'] = amount * 100
        vnp_Params['vnp_ReturnUrl'] = returnUrl
        vnp_Params['vnp_IpAddr'] = ipAddr
        vnp_Params['vnp_CreateDate'] = createDate
        vnp_Params['vnp_BankCode'] = bankCode

        vnp_Params = this.sortObject(vnp_Params)
        let signData = querystring.stringify(vnp_Params, { encode: false })
        let hmac = crypto.createHmac('sha512', secretKey)
        let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex')
        vnp_Params['vnp_SecureHash'] = signed
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false })
        console.log('vpnURL', vnpUrl)
        res.json(vnpUrl)
    }

    async statusTransaction(req: Request) {
        let actionId = req?.['vnp_ActionId']
        let vnp_Params = req.query

        console.log('actionId', actionId)

        let secureHash = vnp_Params['vnp_SecureHash']

        delete vnp_Params['vnp_SecureHash']
        delete vnp_Params['vnp_SecureHashType']

        vnp_Params = this.sortObject(vnp_Params)

        let secretKey = this.configService.get('app.vnp_HashSecret')

        let signData = querystring.stringify(vnp_Params, { encode: false })
        let crypto = require('crypto')
        let hmac = crypto.createHmac('sha512', secretKey)
        let signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex')

        if (secureHash === signed) {
            this.socketClient.emit(statusOfTransaction, {
                id: actionId,
                action: true,
                msg: 'Thanh toán thành công'
            })
        } else {
            this.socketClient.emit(statusOfTransaction, {
                id: actionId,
                action: false,
                msg: 'Thanh toán thất bại'
            })
        }
    }
}
