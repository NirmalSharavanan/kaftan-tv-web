import { ResponseBase } from "./responseBase";
import { float } from "aws-sdk/clients/lightsail";

export class Subscription extends ResponseBase {
    id: string;
    paymentPlan: string;
    featuresary: Array<string>;
    amount: float;
    isActive: boolean;
}