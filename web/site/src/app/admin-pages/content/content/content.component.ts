import { ArrayUtils } from './../../../common/utils/array-utils';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Content } from './../../../models/content';
import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/components/common/messageservice';
import { ContentService } from 'app/services/content.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ss-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  contentType: string;

  contents: Content[];

  preview: boolean;
  videoUrl: string;
  fg: FormGroup;
  uploadedDate: any;
  selectedDate: any;
  searchTitle: string;
  searchDate: string;

  constructor(fb: FormBuilder,
    private service: ContentService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute) {
    this.fg = fb.group({
      title: fb.control(''),
      date: fb.control(''),
    })
    this.uploadedDate = [
      { name: 'Select', code: '0' },
      { name: 'This Week', code: '1' },
      { name: 'This Month', code: '2' },
      { name: 'This Year', code: '3' },
      { name: 'Before This Year', code: '4' },
    ];
  }

  ngOnInit() {
    this.preview = false;
    this.init();
  }

  private init() {
    // console.log('filter option :', this.activatedRoute.snapshot.url[0].path);
    if (!this.contentType) {
      this.contentType = this.activatedRoute.snapshot.url[0].path;
    }
    this.service.getAllContents(this.contentType)
      .subscribe((outcome: Content[]) => {
        if (outcome) {
          this.contents = outcome;
        }
      });
  }

  loadData(event) {
    //event.first = First row offset
    //event.rows = Number of rows per page
  }

  playPreview(videoUrlParam: string) {
    this.videoUrl = videoUrlParam;
    this.preview = true;
  }

  onSearch() {
    this.searchTitle = "";
    this.searchDate = "";

    this.searchTitle = this.fg.get('title').value;
    if (this.selectedDate) {
      if (this.selectedDate.code != "0") {
        this.searchDate = this.selectedDate.code;
      }
    }
    if (this.searchTitle || this.searchDate) {
      this.service.searchContent(this.contentType, this.searchTitle, this.searchDate)
        .subscribe((outcome: Content[]) => {
          if (outcome) {
            this.contents = outcome;
          }
        });
    }
    else {
      this.init();
    }
  }

}
