import { ResponseBase } from 'app/models/responseBase';
import { WalletOperators } from './WalletOperators';

export class WalletCharges extends ResponseBase {
    id: string;
    operatorId: string;
    hasPercentage: boolean;
    chargeValue: string;
    operatorInfo: WalletOperators;
}