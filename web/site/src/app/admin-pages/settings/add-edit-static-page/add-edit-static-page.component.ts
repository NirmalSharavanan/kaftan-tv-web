import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormGroupUtils } from './../../../common/utils/form-group-utils';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { MessageService } from 'primeng/components/common/messageservice';
import { StaticPage } from './../../../models/StaticPage';
import { StaticPagesService } from './../../../services/static-pages.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

@Component({
  selector: 'ss-add-edit-static-page',
  templateUrl: './add-edit-static-page.component.html',
  styleUrls: ['./add-edit-static-page.component.scss']
})
export class AddEditStaticPageComponent implements OnInit {

  fg: FormGroup;
  positions: any;
  pageId: string;
  staticPage: StaticPage;

  constructor(fb: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute,
    private messageService: MessageService, private service: StaticPagesService) {

    this.fg = fb.group({
      pageName: fb.control('', [Validators.required]),
      display_at: fb.control(''),
      is_externalLink: fb.control(false),
      externalLink: fb.control(''),
      content: fb.control(''),

      displayPosition: fb.control('', [Validators.required]),
    })
    this.positions = [
      { position: 'Header', id: '1' },
      { position: 'Footer', id: '2' },
    ];
  }

  get displayPosition() {
    return this.fg.get('displayPosition').value;
  }

  get is_externalLink() {
    if (this.fg.get('is_externalLink').value) {
      this.fg.get('content').clearValidators();
      this.fg.get('content').updateValueAndValidity();
    }
    else {
      this.fg.get('externalLink').clearValidators();
      this.fg.get('externalLink').updateValueAndValidity();
    }
    return this.fg.get('is_externalLink').value;
  }

  get content() {
    return this.fg.get('content').value;
  }

  ngOnInit() {
    this.activatedRoute.paramMap
      .map((value: ParamMap) => {
        return value.get("pageId");
      })
      .flatMap((pageId: string) => {
        if (pageId) {
          return this.service.getStaticPage(pageId);
        } else {
          return Observable.of(null);
        }
      })
      .subscribe((response: StaticPage) => {
        if (response) {
          this.pageId = response.id;

          this.positions.forEach((item) => {
            if (response.display_at == item.position) {
              this.fg.get('displayPosition').setValue(item);
            }
          });

          FormGroupUtils.applyValue(this.fg, response);
        }
      })
  }

  onSubmit() {

    this.fg.get("display_at").setValue(this.displayPosition.position);

    let staticPageObs: Observable<any>;
    if (this.pageId) {
      staticPageObs = this.service.updateStaticPage(this.fg.value, this.pageId);
    }
    else {
      staticPageObs = this.service.addStaticPage(this.fg.value);
    }
    staticPageObs.subscribe(
      (value: StaticPage) => {
        if (value.success) {
          this.router.navigate(['/admin/settings/static-pages']);
        }
        else {
          this.messageService.add({ severity: 'error', summary: value.message, detail: '' });
        }
      });
  }

}
