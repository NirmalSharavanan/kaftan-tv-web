import { Category } from 'app/models/Category';
import { Content } from './../../../models/content';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'ss-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {

  @Input() bannerImageUrl: string;
  private url: SafeResourceUrl;

  @Input()
  content: Content;

  @Output() showPlayer: EventEmitter<boolean>;

  playTrailer: boolean;
  // showPlayer: boolean = false;

  constructor(private sanitizer: DomSanitizer) {
    this.showPlayer = new EventEmitter();
  }

  ngOnInit() {
    if (this.content && this.content.youtube_TrailerLink) {
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.content.youtube_TrailerLink);
    }
  }

  playTrailers() {
    this.playTrailer = true;
  }

  cancelPlayTrailers() {
    this.playTrailer = false;
  }
  togglePlayer($event) {
    this.showPlayer.emit($event);
  }

}
