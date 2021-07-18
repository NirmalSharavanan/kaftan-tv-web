import { ResponseBase } from 'app/models/responseBase';

export class WalletOperators extends ResponseBase {
    id: string;
    name: string;
    serviceType: number;
    categoryId: number;
    categoryCode: string;
    categoryName: string;
    operatorCode: string;
    operatorName: string;
    operatorImage: string;
    active: boolean;
}