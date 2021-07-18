import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormGroupUtils } from './../../../common/utils/form-group-utils';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { MessageService } from 'primeng/components/common/messageservice';
import { MobileAppService } from './../../../services/mobile-app.service';
import { AppUpdate } from './../../../models/AppUpdate';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

@Component({
  selector: 'ss-add-edit-app-update',
  templateUrl: './add-edit-app-update.component.html',
  styleUrls: ['./add-edit-app-update.component.scss']
})
export class AddEditAppUpdateComponent implements OnInit {

  appUpdateId: string;
  fg: FormGroup;

  constructor(fb: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute,
    private messageService: MessageService, private service: MobileAppService) {

    this.fg = fb.group({
      deviceType: fb.control('', [Validators.required]),
      currentVersion: fb.control('', [Validators.required]),
      description: fb.control('', [Validators.required])
    })

  }

  ngOnInit() {
    this.activatedRoute.paramMap
    .map((value: ParamMap) => {
      return value.get("appUpdateId");
    })
    .flatMap((appUpdateId: string) => {
      if (appUpdateId) {
        return this.service.getAppUpdate(appUpdateId);
      } else {
        return Observable.of(null);
      }
    })
    .subscribe((response: AppUpdate) => {
      if (response) {
        this.appUpdateId = response.id;
        FormGroupUtils.applyValue(this.fg, response);
      }
    })
  }

  onSubmit() {
    let updateObs: Observable<any>;
    if (this.appUpdateId) {
      updateObs = this.service.updateAppUpdate(this.fg.value, this.appUpdateId);
    }
    else {
      updateObs = this.service.addAppUpdate(this.fg.value);
    }
    updateObs.subscribe(
      (value: any) => {
        if (value.success) {
          this.router.navigate(['/admin/mobile-apps/app-update']);
        }
        else {
          this.messageService.add({ severity: 'error', summary: value.message, detail: '' });
        }
      });
  }

}
