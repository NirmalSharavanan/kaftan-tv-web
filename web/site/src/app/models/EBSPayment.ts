
import { User } from './user';

export class EBSPayment {
    accountId : string;
    secure_hash : string;
    referenceNo : string;
    user : User;
    amount : number;
    redirect_url : string;
    address : string;
    city : string;
    state : string;
    country : string;
    postalCode : string;
    channel : string;
    mode : string;
    currency : string;
    description : string;
    subscriptionId:string;
}