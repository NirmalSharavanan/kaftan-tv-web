import { ResponseBase } from './responseBase';

export class StaticPage extends ResponseBase {
    id: string;
    pageName: string;
    pageUrl: string;
    display_at: string;
    is_externalLink: string;
    externalLink: string;
    content: string;
    sort_order : number;
}