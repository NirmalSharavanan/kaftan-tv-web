import { ResponseBase } from './responseBase';

export class PageMetaData extends ResponseBase {
    id: string;
    page_type: string;
    page_name: string;
    title: string;
    description: string;
    keywords: Array<string>;
}