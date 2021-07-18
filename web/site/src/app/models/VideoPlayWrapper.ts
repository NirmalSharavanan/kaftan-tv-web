import { VideoPlayInfo } from './VideoPlayInfo';
import { ResponseBase } from './responseBase';

export class VideoPlayWrapper extends ResponseBase {
    videoPlayInfoList: VideoPlayInfo[];
}
