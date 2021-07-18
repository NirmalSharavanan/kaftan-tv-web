import { VideoConfig } from './../../../ss-core/model/video-config';
import { ChannelInfo } from './../../../models/channel-info';
import { VideoPlayInfo } from './../../../models/VideoPlayInfo';
import { VideoPlayWrapper } from './../../../models/VideoPlayWrapper';
import { AuthenticationService } from './../../../services/authentication.service';
import { SessionStorageService } from './../../../common/service/session-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from './../../../services/content.service';
import { Content } from 'app/models/content';
import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { Location } from '@angular/common';
import { Video } from '../../../ss-core/model/video';
import { ContentWatchHistory } from './../../../models/contentWatchHistory';

@Component({
  selector: 'ss-play-home',
  templateUrl: './play-home.component.html',
  styleUrls: ['./play-home.component.scss']
})
export class PlayHomeComponent implements OnInit {

  contentId: string;
  videoPlayWrapper: VideoPlayWrapper;
  private sub: any;
  previousPage: String;
  content: Content;
  backgroundUrl: any;
  has_access_to_preminum: boolean;
  premium_message: string;
  invalidUser: boolean;
  isAuthenticated: boolean;
  currentTime: string;
  contentWatchHistory: ContentWatchHistory[];

  @Input() playerInfo: VideoPlayWrapper;

  constructor(private sessionStorageService: SessionStorageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private service: ContentService,
    private authService: AuthenticationService,
    private location: Location
  ) { }

  ngOnInit() {

    this.invalidUser = false;

    this.authService.isUserAuthenticated()
      .subscribe((isAuth: boolean) => {
        this.isAuthenticated = isAuth;
      });

    // this.activatedRoute.parent.paramMap
    // .subscribe((params: ParamMap) => {
    // this.contentId = params.get('id');
    // this.loadContent();
    // });

    if (this.playerInfo) {
      this.videoPlayWrapper = this.playerInfo;
    } else {
      this.contentId = this.activatedRoute.snapshot.paramMap.get('id');

      if (this.contentId) {
        this.loadContent();
      }
    }
    if (this.authService.getUser()) {
      this.getContentWatchHistory();
    }
  }

  loadContent() {
    if (this.contentId) {
      this.service.getContent(this.contentId, true)
        .subscribe((response: Content) => {
          this.content = response;

          if (this.content && this.content._links && this.content._links.awsBannerUrl.href) {
            this.backgroundUrl = 'url(\'' + this.content._links.awsBannerUrl.href + '\')';
          }

          if (this.isAuthenticated) {
            Observable.timer(2000).subscribe(x => {
              this.getVideoUrl();
            });
          } else {
            this.invalidUser = true;
          }
        });
    }
  }


  getVideoUrl() {
    if (this.content) {
      this.service.getContentToWatch(this.content.id, true)
        .subscribe((response: VideoPlayWrapper) => {
          if (response) {
            if (response.success) {
              console.log('the url from the content is ', response);
              this.videoPlayWrapper = response;
              // console.log(this.videoPlayWrapper);

              // if (this.videoPlayWrapper) {
              //   this.videoPlayWrapper.videoPlayInfoList.forEach((value: VideoPlayInfo) => {
              //     if (this.content.content_type === 'audio') {
              //       value.audioBanner = this.content._links.awsBannerUrl.href;
              //     }
              //   });
              // }
            } else {
              this.invalidUser = true;

              if (this.content.is_premium) {
                this.premium_message = response.message;
                this.has_access_to_preminum = false;
              }
            }
          }
        });
    }
  }

  // private addChannel() {
  //   this.videoPlayWrapper = new VideoPlayWrapper();
  //   this.videoPlayWrapper.videoPlayInfoList = [];
  //   const playInfo = new VideoPlayInfo();
  //   playInfo.sdVideoUrl = this.channelInfo.videoUrl;
  //   playInfo.audioBanner = this.channelInfo.banner;
  //   this.videoPlayWrapper.videoPlayInfoList.push(playInfo);
  // }

  navigateBack() {
    this.location.back();
  }

  // get title() {
  //   return (this.content && this.content.title) ? this.content.title : this.channelInfo.videoTitle;
  // }

  // ngOnDestroy() {
  //   this.sub.unsubscribe();
  // }

  get videoConfig() {
    const videoConfig = new VideoConfig();
    const VideoPlayInfos = this.videoPlayWrapper.videoPlayInfoList;
    if (VideoPlayInfos && VideoPlayInfos.length > 0) {
      if (VideoPlayInfos[0].isYouTubeUrl) {
        const video = new Video('', 'youtube');
        video.youtubeID = VideoPlayInfos[0].sdVideoUrl.split('/').pop();
        videoConfig.videos.push(video);
      } else {
        VideoPlayInfos.forEach((videoPlayInfo: VideoPlayInfo, index: number) => {

          const video = new Video('');
          video.description = videoPlayInfo.title;

          if (videoPlayInfo.audioBanner) {
            video.imageUrl = videoPlayInfo.audioBanner;
          }

          if (videoPlayInfo.audioThumbnail) {
            video.thumbImg = videoPlayInfo.audioThumbnail;
          }

          if (videoPlayInfo.sdVideoUrl) {
            video.mp4SD = videoPlayInfo.sdVideoUrl;
          }

          if (videoPlayInfo.hdVideoUrl) {
            video.mp4HD = videoPlayInfo.hdVideoUrl;
          }
          video.currentTime = this.currentTime;

          videoConfig.videos.push(video);
        });

        // console.log(videoConfig);
        // videoConfig.videos.push(video);
      }
    }

    return videoConfig;
  }

  getContentWatchHistory() {
    this.service.getContentToWatchHistory()
      .subscribe((response: ContentWatchHistory[]) => {
        if (response) {
          this.contentWatchHistory = response;
          this.contentWatchHistory = this.contentWatchHistory.filter(item => {return item.content_id === this.contentId});
          if(this.contentWatchHistory.length > 0) {
            this.currentTime = this.contentWatchHistory[0].currentTime;
          }
        }
      });
         
  }
}
