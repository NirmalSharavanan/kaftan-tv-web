import { ResponseBase } from 'app/models/responseBase';

export class HomeBanner extends ResponseBase {
    id: string;
    text: string;
    sort_order: number;
    redirectUrl: string;
}
