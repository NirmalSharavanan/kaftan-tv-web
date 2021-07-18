import { ResponseBase } from './responseBase';

export class PaymentGateWay extends ResponseBase {
    payment_gateway: number;
    key_id: string;
    key_secret: string;
    premium_plan_id: string;

    //EBS
    accountId: string;
    secureKey: string;
    mode: string;
}