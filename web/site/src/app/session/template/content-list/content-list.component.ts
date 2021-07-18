import { Component, OnInit, Input } from '@angular/core';
import { Content } from 'app/models/content';
import { Blog } from 'app/models/blog';
import { Category } from 'app/models/Category';

@Component({
  selector: 'ss-content-list',
  templateUrl: './content-list.component.html',
  styleUrls: ['./content-list.component.scss']
})
export class ContentListComponent implements OnInit {

  @Input() contentList: Content[];
  @Input() videoContentList: Content[];
  @Input() audioContentList: Content[];
  @Input() radioCategoryList: Category[];
  @Input() blogList: Blog[];
  @Input() channelCategoryList: Category[];

  pageType: string = "songs";

  constructor() { }

  ngOnInit() {
  }

}
