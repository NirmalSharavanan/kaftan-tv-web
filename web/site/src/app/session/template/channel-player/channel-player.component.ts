import { VideoPlayInfo } from './../../../models/VideoPlayInfo';
import { ChannelInfo } from './../../../models/channel-info';
import { Category } from './../../../models/Category';
import { Component, OnInit, Input } from '@angular/core';
import { AuthenticationService } from './../../../services/authentication.service';
import { VideoPlayWrapper } from '../../../models/VideoPlayWrapper';

@Component({
  selector: 'ss-channel-player',
  templateUrl: './channel-player.component.html',
  styleUrls: ['./channel-player.component.scss']
})
export class ChannelPlayerComponent implements OnInit {

  @Input() category: Category;
  showPlayer = false;
  isAuthenticated: boolean;
  playLiveVideo: boolean;
  channelInfo: VideoPlayWrapper;

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
    this.authService.isUserAuthenticated()
      .subscribe((isAuth: boolean) => {
        this.isAuthenticated = isAuth;
      });
    this.initChannel();
  }

  private initChannel() {
    if (this.category) {
      this.addChannel();
    }
  }
  cancel() {
    this.playLiveVideo = false;
    return false;
  }

  playVideo() {
    this.playLiveVideo = true;

    if (this.isAuthenticated) {
      this.showPlayer = true;
    }
  }

  private addChannel() {
    this.channelInfo = new VideoPlayWrapper();
    this.channelInfo.videoPlayInfoList = [];
    const playInfo = new VideoPlayInfo();
    playInfo.sdVideoUrl = this.category.liveUrl.live480Url;
    if (this.category._links && this.category._links.awsBannerUrl) {
      playInfo.audioBanner = this.category._links.awsBannerUrl.href;
    }
    this.channelInfo.videoPlayInfoList.push(playInfo);
  }

}
