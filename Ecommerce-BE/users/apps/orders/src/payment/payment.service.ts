import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as CryptoJS from 'crypto-js'
import { format } from 'date-fns'
import { Request, Response } from 'express'
import * as querystring from 'qs'
import { CreatePaymentDTO } from '../dtos/payment.dto'

@Injectable()
export class PaymentService {
    constructor(private readonly configService: ConfigService) {}

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
        let { amount, bankCode } = body
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

        let orderId = format(date, 'ddHHmmss')

        let currCode = 'VND'
        let vnp_Params: { [key: string]: any } = {}
        vnp_Params['vnp_Version'] = '2.1.0'
        vnp_Params['vnp_Command'] = 'pay'
        vnp_Params['vnp_TmnCode'] = tmnCode
        vnp_Params['vnp_Locale'] = 'vn'
        vnp_Params['vnp_CurrCode'] = currCode
        vnp_Params['vnp_TxnRef'] = orderId
        vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId
        vnp_Params['vnp_OrderType'] = 'other'
        vnp_Params['vnp_Amount'] = amount * 100
        vnp_Params['vnp_ReturnUrl'] = returnUrl
        vnp_Params['vnp_IpAddr'] = ipAddr
        vnp_Params['vnp_CreateDate'] = createDate
        vnp_Params['vnp_BankCode'] = bankCode

        vnp_Params = this.sortObject(vnp_Params)
        let signData = querystring.stringify(vnp_Params, { encode: false })
        let hmac = CryptoJS.HmacSHA512(signData, secretKey)
        let signed = hmac.toString(CryptoJS.enc.Hex)
        vnp_Params['vnp_SecureHash'] = signed
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false })
        console.log('vpnURL', vnpUrl)
        res.json(vnpUrl)
    }
}
