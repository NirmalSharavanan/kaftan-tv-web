import { Router } from '@angular/router';
import { Category } from 'app/models/Category';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ss-channel-thumbnail',
  templateUrl: './channel-thumbnail.component.html',
  styleUrls: ['./channel-thumbnail.component.scss']
})
export class ChannelThumbnailComponent implements OnInit {

  @Input() asVerticalList: boolean;
  @Input() channel: Category;

  constructor() { }

  ngOnInit() {

  }

}
