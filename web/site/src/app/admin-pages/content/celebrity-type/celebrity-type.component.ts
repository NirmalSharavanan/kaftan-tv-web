import { CelebrityTypeService } from './../../../services/celebrity-type.service';
import { CelebrityType } from './../../../models/CelebrityType';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ss-celebrity-type',
  templateUrl: './celebrity-type.component.html',
  styleUrls: ['./celebrity-type.component.scss']
})
export class CelebrityTypeComponent implements OnInit {

  celebrityTypes: CelebrityType[];
  celebrityTypeOrg: string[];
  isSaveEnabled: boolean;

  constructor(private service: CelebrityTypeService) { }

  ngOnInit() {
    this.init();
  }

  onReorder() {
  }

  enableSave() {
    this.isSaveEnabled = true;
  }

  private init() {
    this.service.getAllCelebrityType()
      .subscribe((outcome: CelebrityType[]) => {
        this.celebrityTypes = outcome;
        this.celebrityTypeOrg = this.celebrityTypes.map((celebrityType: CelebrityType) => {
          return celebrityType.id;
        });
      });
  }

}


