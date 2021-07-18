import { PaymentInfo } from './PaymentInfo';
import { ResponseBase } from './responseBase';
import { Customer } from './customer';
import { PlayList } from './PlayList';

export class User extends ResponseBase {
    id: string;
    email: string;
    name: string;
    mobileNo: string;
    authorities: Array<string>;
    //customer: Customer;
    favorites: Array<string>;
    paymentInfo: PaymentInfo;
    playList: Array<PlayList>;
    is_premium: boolean;
}
