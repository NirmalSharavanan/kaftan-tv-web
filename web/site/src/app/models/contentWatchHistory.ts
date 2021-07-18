import { ResponseBase } from "./responseBase";
import { Content } from "./../models/content";

export class ContentWatchHistory extends ResponseBase {
    content_id : string;
    currentTime : string;
    totalTime : string;
    inProgress : boolean;
    content : Content;
}