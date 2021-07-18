import { CelebrityType } from './../../../models/CelebrityType';
import { FormGroupUtils } from './../../../common/utils/form-group-utils';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CelebrityTypeService } from './../../../services/celebrity-type.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

@Component({
  selector: 'ss-add-celebrity-type',
  templateUrl: './add-celebrity-type.component.html',
  styleUrls: ['./add-celebrity-type.component.scss']
})
export class AddCelebrityTypeComponent implements OnInit {
  fg: FormGroup;
  celebrityTypeId: string;
  celebrityType: CelebrityType[];

  constructor(fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private service: CelebrityTypeService) {
    this.fg = fb.group({
      name: fb.control('', [
        Validators.required]),
    });
  }

  enableSave() {

  }

  onSubmit() {
    let celebrityObs: Observable<any>;
    if (this.celebrityTypeId) {
      celebrityObs = this.service.updateCelebrityType(FormGroupUtils.extractValue(this.fg, this.celebrityType));
    }
    else {
      celebrityObs = this.service.addCelebrityType(this.fg.value);
    }
    celebrityObs.subscribe(
      (value: any) => {
        if (value.success) {
          this.router.navigate(['/admin/content/celebrityType']);
        }
      });
  }

  ngOnInit() {
    this.activatedRoute.paramMap
      .map((value: ParamMap) => {
        return value.get("celebrityTypeId");
      })
      .flatMap((celebrityTypeId: string) => {
        if (celebrityTypeId) {
          return this.service.getCelebrityType(celebrityTypeId);
        } else {
          return Observable.of(null);
        }
      })
      .subscribe((response: any) => {
        if (response) {
          this.celebrityTypeId = response.id;
          this.celebrityType = response;
          FormGroupUtils.applyValue(this.fg, response);
        }
      })
  }

}
