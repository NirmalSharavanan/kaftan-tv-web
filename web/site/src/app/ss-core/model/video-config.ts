import { Video } from './video';
export class VideoConfig {
    playlist = 'Off';
    playerLayout = 'fitToContainer';
    hideVideoSource = true;
    rightClickMenu = false;
    shareShow = false;
    embedShow = false;
    autoplay = true;
    onFinish = 'Stop video';
    youtubeShowRelatedVideos = false;
    qualityShow = true;
    // nextShow = true;
    videos: Video[] = [];
}
