import { ResponseBase } from 'app/models/responseBase';
import { WalletOperators } from './WalletOperators';

export class WalletStockPurchase extends ResponseBase {

    serviceType: number;
    operatorId: string;
    purchaseCost: string;
    purchaseAmount: string;
    registerMacing: string;
    created_at: Date;
    serviceInfo: WalletOperators;
    operatorName: string;
    stockAlerts:any;
}