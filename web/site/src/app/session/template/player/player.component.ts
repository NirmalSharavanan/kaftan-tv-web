import { VideoPlayInfo } from './../../../models/VideoPlayInfo';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ss-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  @Input() videoPlayInfoList: VideoPlayInfo[];
  @Input() videoUrl: string;
  @Output() stopPlay: EventEmitter<string[]> = new EventEmitter();
  showControls: string;
  @Input() movieName: string;

  constructor() { }

  ngOnInit() {
    this.showControls = 'display:none';

    if (this.videoPlayInfoList && this.videoPlayInfoList.length > 0) {
      this.videoUrl = this.videoPlayInfoList[0].sdVideoUrl;
      // console.log(this.videoUrl);
    }

  }

  stop() {
    //alert("Test");
    this.stopPlay.emit();
  }

  mouseEnter() {
    this.showControls = 'display: block';
  }

  mouseLeave() {
    this.showControls = 'display:none';
  }

}
