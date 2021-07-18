import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/components/common/messageservice';
import { PageMetaDataService } from './../../../services/page-meta-data.service';
import { PageMetaData } from './../../../models/page-meta-data';

@Component({
  selector: 'ss-meta-data',
  templateUrl: './meta-data.component.html',
  styleUrls: ['./meta-data.component.scss']
})
export class MetaDataComponent implements OnInit {

  metaData: PageMetaData[];

  constructor(private service: PageMetaDataService, private messageService: MessageService) { }

  ngOnInit() {
    this.init();
  }

  private init() {
    this.service.getAllPageMetaData().subscribe((metaData: PageMetaData[]) => {
      if (metaData) {
        this.metaData = metaData;
      }
    })
  }

}
