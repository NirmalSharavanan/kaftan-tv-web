import { Location } from '@angular/common';
import { VideoConfig } from './../model/video-config';
import { Video } from './../model/video';
import { Component, OnInit, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { VideoPlayInfo } from '../../models/VideoPlayInfo';
import { ContentService } from '../../services/content.service';
import { ContentWatchHistory } from './../../models/contentWatchHistory';

declare var $: any;
declare var window: any;

@Component({
  selector: 'ss-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() videoConfig: VideoConfig;
  @Input() movieName: string;
  @Input() contentId: string;

  contentWatchHistory: ContentWatchHistory[];

  constructor(
    private location: Location,
    private service: ContentService) { }

  ngOnInit() {
    if (this.videoConfig.videos.length > 1) {
      // videoConfig.nextShow = false;
      this.videoConfig.playlist = 'Right playlist';
      this.videoConfig.autoplay = false;
      this.videoConfig.qualityShow = false;
      this.videoConfig.onFinish = 'Play next video';
    }
  }

  ngAfterViewInit() {
    this.resetInterval();
    const playerConfig = this.videoConfig;
    const component = this;
    $(document).ready(function () {
      $('#video-player').Video(playerConfig);
      $(document).on('ss-video-loaded', (src, metadata) => {
        if (metadata.video) {
          // Continue watching
          //component.logVideoStatus(component.contentId, metadata.video.currentTime, metadata.video.duration, true);
        }
      });
      $(document).on('ss-video-ended', (src, metadata) => {
        if (metadata.video) {
          // Continue watching
          //component.logVideoStatus(component.contentId, metadata.video.currentTime, metadata.video.duration, false);
        }
      });
    });
  }

  private logVideoStatus(contentId: string, currentTime: string, totalTime: string, inProgress: boolean) {
    const formData = new ContentWatchHistory();
    formData.content_id = contentId;
    formData.currentTime = currentTime;
    formData.totalTime = totalTime;
    formData.inProgress = inProgress;
    this.service.addContentToWatchHistory(formData).subscribe((response: ContentWatchHistory[]) => {
      if (response) {
        this.contentWatchHistory = response;
      }
    })
  }

  ngOnDestroy() {
    this.resetInterval();
  }

  private resetInterval() {
    if (window.videoTimeoutInterval) {
      clearInterval(window.videoTimeoutInterval);
      delete window.videoTimeoutInterval;
    }
    $(document).off('ss-video-loaded');
    $(document).off('ss-video-ended');
  }

  onRightClick($event) {
    return false;
  }

}
