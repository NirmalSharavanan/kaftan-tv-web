import { ResponseBase } from './responseBase';

export class AWSInfo extends ResponseBase {
    id: string;
    content_type: string;
    awsUrl: string;
}
