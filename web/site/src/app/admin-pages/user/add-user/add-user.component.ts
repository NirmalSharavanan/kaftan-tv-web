import { Component, OnInit } from '@angular/core';
import { FormGroupUtils } from './../../../common/utils/form-group-utils';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/components/common/messageservice';
import { UserService } from './../../../services/user.service';
import { User } from './../../../models/user';
import { Roles } from '../../../models/roles';
import { Router, ActivatedRoute, ParamMap, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { GlobalConstants } from 'app/helper/api.constants';

@Component({
  selector: 'ss-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  fg: FormGroup;
  emailPattern = "[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}";
  userId: string;
  user: User[];
  roles: any[];


  constructor(
    fb: FormBuilder,
    private messageService: MessageService,
    private service: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
    this.fg = fb.group({
      name: fb.control('', [Validators.required]),
      email: fb.control('', [Validators.required, Validators.pattern(this.emailPattern)]),
      mobileNo: fb.control('', [Validators.required, Validators.minLength(10)]),
      selectedrolesAry: fb.control('', [Validators.required]),
      authorities: fb.control('')
    });
  }

  ngOnInit() {
    this.activatedRoute.paramMap
      .map((value: ParamMap) => {
        return value.get("userId");
      })
      .flatMap((userId: string) => {
        if (userId) {
          return Observable.forkJoin(
            this.service.getAllRoles(),
            this.service.getUser(userId)
          );
        } else {
          this.getRoles();
          return Observable.of(null);
        }
      })
      .subscribe((response: any) => {
        if (response) {
          this.userId = response.id;
          this.user = response;
          FormGroupUtils.applyValue(this.fg, response);
        }
        if (response && response.length > 0) {
          if (response[0]) {
            this.roles = response[0];
          }

          if (response.length > 1) {
            this.userId = response[1].id;
            this.user = response[1];
            FormGroupUtils.applyValue(this.fg, this.user);

            const selectedObjectes: Roles[] = [];
            if (response[1].authorities) {
              this.roles.forEach((item) => {
                if (response[1].authorities.indexOf(item.role) >= 0) {
                  selectedObjectes.push(item);
                }
              });
            }
            this.fg.get("selectedrolesAry").setValue(selectedObjectes);

            //disable authorities it it is "ROLE_ADMIN"

            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUser.roles != GlobalConstants.ROLE_SUPER_USER && currentUser.roles == GlobalConstants.ADMIN_USER) {
              this.fg.get("selectedrolesAry").disable();
            }

          }

        }
      })
  }

  getRoles() {
    this.service.getAllRoles()
      .subscribe((response: any) => {
        this.roles = response;
      });
  }

  onValueChange() {
    this.fg.get("authorities").setValue((this.fg.get("selectedrolesAry").value as Roles[])
      .map((value: Roles) => value.role))
  }

  onSubmit() {
    let userObs: Observable<any>;
    if (this.userId) {
      userObs = this.service.updateAdminUsers(FormGroupUtils.extractValue(this.fg, this.user));
    }
    else {
      // this.fg.get("authorities").setValue(null);
      userObs = this.service.addAdminUsers(this.fg.value);
    }
    userObs.subscribe(
      (value: any) => {
        if (value.success) {
          this.router.navigate(['/admin/user-management/users']);
        }
        else {
          this.messageService.add({ severity: 'error', summary: value.message, detail: '' });
        }
      });
  }

}
