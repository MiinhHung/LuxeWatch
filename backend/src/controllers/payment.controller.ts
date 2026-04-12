import { Request, Response } from 'express';
import crypto from 'crypto';
import qs from 'qs';
// @ts-expect-error Types missing
import dateformat from 'dateformat';
import { prisma } from '../utils/prisma';
import { AuthRequest } from '../middlewares/authMiddleware';

export const createPaymentUrl = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId, amount, bankCode, language } = req.body;

    const tmnCode = process.env.VNPAY_TMN_CODE;
    const secretKey = process.env.VNPAY_HASH_SECRET;
    let vnpUrl = process.env.VNPAY_URL;
    const returnUrl = process.env.VNPAY_RETURN_URL;

    if (!tmnCode || !secretKey || !vnpUrl || !returnUrl) {
      res.status(500);
      throw new Error('VNPAY configuration is missing');
    }

    const date = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const createDate = date.getFullYear().toString() +
                       pad(date.getMonth() + 1) +
                       pad(date.getDate()) +
                       pad(date.getHours()) +
                       pad(date.getMinutes()) +
                       pad(date.getSeconds());
    
    // Add Expire Date (15 minutes)
    const expireDateRaw = new Date(date.getTime() + 15 * 60000);
    const expireDate = expireDateRaw.getFullYear().toString() +
                       pad(expireDateRaw.getMonth() + 1) +
                       pad(expireDateRaw.getDate()) +
                       pad(expireDateRaw.getHours()) +
                       pad(expireDateRaw.getMinutes()) +
                       pad(expireDateRaw.getSeconds());

    let ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    if (Array.isArray(ipAddr)) {
      ipAddr = ipAddr[0];
    }
    
    const vnp_Params: any = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = language || 'vn';
    vnp_Params['vnp_CurrCode'] = 'VND';
    // Use unique ref to avoid "Transaction timed out" if user re-clicks
    vnp_Params['vnp_TxnRef'] = `${orderId}_${createDate}`; 
    vnp_Params['vnp_OrderInfo'] = `Thanh toan cho ma GD: ${orderId}`;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = Math.round(amount * 100);
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    vnp_Params['vnp_ExpireDate'] = expireDate;

    if (bankCode !== null && bankCode !== '' && bankCode !== undefined) {
      vnp_Params['vnp_BankCode'] = bankCode;
    }

    // Sort parameters
    const sorted = sortObject(vnp_Params);

    // SIGN DATA (NO ENCODING)
    const signData = qs.stringify(sorted, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    
    // Add signature to parameters
    sorted['vnp_SecureHash'] = signed;
    
    // FINAL URL (WITH ENCODING)
    vnpUrl += '?' + qs.stringify(sorted, { encode: true });

    res.status(200).json({ url: vnpUrl });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    let vnp_Params = req.query as any;
    const secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    const secretKey = process.env.VNPAY_HASH_SECRET;

    if (!secretKey) {
       res.status(500).json({ message: 'Missing hash secret' });
       return;
    }

    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash === signed) {
      const txnRef = vnp_Params['vnp_TxnRef'];
      const orderId = txnRef.split('_')[0];
      const rspCode = vnp_Params['vnp_ResponseCode'];

      if (rspCode === '00') {
         await prisma.order.update({
             where: { id: Number(orderId) },
             data: {
                 paymentStatus: 'paid',
                 vnpayTxnId: vnp_Params['vnp_TransactionNo']
             }
         });
         res.json({ success: true, message: 'Payment verified and order updated' });
      } else {
         res.json({ success: false, code: rspCode, message: 'Payment failed' });
      }
    } else {
      res.json({ success: false, code: '97', message: 'Checksum failed' });
    }
  } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
  }
};

export const ipnPayment = async (req: Request, res: Response) => {
  try {
    let vnp_Params = req.query as any;
    const secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    const secretKey = process.env.VNPAY_HASH_SECRET;

    if (!secretKey) {
       res.json({ RspCode: '99', Message: 'Missing secret' });
       return;
    }

    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash === signed) {
      const txnRef = vnp_Params['vnp_TxnRef'];
      const orderId = txnRef.split('_')[0];
      const rspCode = vnp_Params['vnp_ResponseCode'];

      if (rspCode === '00') {
         await prisma.order.update({
             where: { id: Number(orderId) },
             data: {
                 paymentStatus: 'paid',
                 vnpayTxnId: vnp_Params['vnp_TransactionNo']
             }
         });
         res.status(200).json({ RspCode: '00', Message: 'Confirm success' });
      } else {
         res.status(200).json({ RspCode: '00', Message: 'Confirm success' });
      }
    } else {
      res.status(200).json({ RspCode: '97', Message: 'Checksum failed' });
    }
  } catch (error: any) {
      res.status(200).json({ RspCode: '99', Message: 'Unkown error' });
  }
};

function sortObject(obj: any) {
  const sorted: any = {};
  const str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[decodeURIComponent(str[key])] = obj[decodeURIComponent(str[key])];
  }
  return sorted;
}
