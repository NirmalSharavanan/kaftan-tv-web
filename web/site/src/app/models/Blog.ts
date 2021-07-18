import { ResponseBase } from './responseBase';

export class Blog  extends ResponseBase {
    id: string;
    title: string;
    conent: string;
    sort_order : number;
    updated_at: Date;
}