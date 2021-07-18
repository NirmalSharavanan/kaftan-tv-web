export class Video {

    mp4SD: string;
    mp4HD: string;
    youtubeID: string;
    imageUrl: string;
    thumbImg: string;
    description: string;
    currentTime: string;
    
    constructor(private title: string, private videoType = 'HTML5') {

    }


}
