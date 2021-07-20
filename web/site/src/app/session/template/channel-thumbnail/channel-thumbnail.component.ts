import { Router } from '@angular/router';
import { Category } from 'app/models/Category';
import { Component, OnInit, Input } from '@angular/core';
import { NavigateWithUrl } from 'app/services/navigate-with-url.service';

@Component({
  selector: 'ss-channel-thumbnail',
  templateUrl: './channel-thumbnail.component.html',
  styleUrls: ['./channel-thumbnail.component.scss']
})
export class ChannelThumbnailComponent implements OnInit {

  @Input() asVerticalList: boolean;
  @Input() channel: Category;

  constructor(private navigateWithUrl: NavigateWithUrl, private router: Router) { }

  ngOnInit() {

  }
  navigateToCategories(channelData: Category) {
    console.log(channelData);
    this.navigateWithUrl.setNavigateData({ name:channelData.name, id: channelData.id })
    this.router.navigate([channelData._links.UIHref.href.replace(channelData.id, channelData.name)]);
  }

}
