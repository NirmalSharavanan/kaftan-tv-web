import { ResponseBase } from './responseBase';

export class Device extends ResponseBase {
    id: string;
    deviceName: string;
    active: boolean;
    sort_order : number;
    _links: {
        awsIconUrl: {
            href: string;
        }
        UIHref: {
            href: string;
        };
    }
}