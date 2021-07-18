import { ResponseBase } from "./responseBase";
import { Content } from './content';

export class AWSContentUsage extends ResponseBase {
    user_id: string;
    content_id: string;
    email : string;
    contentTitle : string;
    bytesUploaded: string;
    bytesDownloaded: string;
    accessed_datetime: Date;
    totalBytesDownloaded: any;
    totalBytesUploaded: number;
    content: Content;
    accessedDate: string; //get date without time
}