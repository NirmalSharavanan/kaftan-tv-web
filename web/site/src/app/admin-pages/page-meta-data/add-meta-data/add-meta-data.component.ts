import { Component, OnInit } from '@angular/core';
import { FormGroupUtils } from './../../../common/utils/form-group-utils';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/components/common/messageservice';
import { PageMetaDataService } from './../../../services/page-meta-data.service';
import { PageMetaData } from './../../../models/page-meta-data';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

@Component({
  selector: 'ss-add-meta-data',
  templateUrl: './add-meta-data.component.html',
  styleUrls: ['./add-meta-data.component.scss']
})
export class AddMetaDataComponent implements OnInit {

  fg: FormGroup;
  metaDataId: string;
  metaData: PageMetaData[];

  constructor(
    fb: FormBuilder,
    private messageService: MessageService,
    private service: PageMetaDataService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
    this.fg = fb.group({
      page_type: fb.control('', [Validators.required]),
      page_name: fb.control('', [Validators.required]),
      title: fb.control('', [Validators.required]),
      description: fb.control('', [Validators.required]),
      keywords: fb.control('', [Validators.required]),
    });
  }

  ngOnInit() {
  }

  onSubmit() {

  }
}
