import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormGroupUtils } from './../../../common/utils/form-group-utils';
import { MessageService } from 'primeng/components/common/messageservice';
import { CustomerService } from './../../../services/customer.service';
import { Customer } from './../../../models/customer';
import { Observable } from 'rxjs';

@Component({
  selector: 'ss-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {

  fg: FormGroup;
  customer: Customer;
  emailHeaderImage: File = null;
  emailHeaderImageUrl: string;
  isEmailHeaderImage: boolean = false;

  constructor(fb: FormBuilder,
    private messageService: MessageService, private service: CustomerService) {

    this.fg = fb.group({
      smtp_host: fb.control('', Validators.required),
      smtp_port: fb.control('', [Validators.required, Validators.pattern('[0-9]+')]),
      smtp_from_email: fb.control('', Validators.required),
      smtp_password: fb.control('', Validators.required),
      smtp_subject_prefix: fb.control('', Validators.required)
    });

  }

  private init() {
    this.service.getCustomerForAdmin()
      .subscribe((customer: Customer) => {
        if (customer) {
          this.customer = customer;
          FormGroupUtils.applyValue(this.fg, customer);
          if (customer._links.awsEmailHeaderUrl) {
            this.emailHeaderImageUrl = customer._links.awsEmailHeaderUrl.href;
            this.isEmailHeaderImage = true;
          }
        }
      });
  }

  ngOnInit() {
    this.init()
  }

  onSubmit() {
    if (!this.isEmailHeaderImage && this.emailHeaderImage == null) {
      this.messageService.add({ severity: 'error', summary: "Please upload email header image", detail: '' });
    }
    else {
      this.getContentObs().map((value: Customer) => {
        return value;
      }).flatMap((value: Customer) => {
        if (value.success) {
          if (this.emailHeaderImage) {
            return this.getImageObservables();
          } else {
            this.messageService.add({ severity: 'info', summary: value.message, detail: '' });
          }
        } else {
          this.messageService.add({ severity: 'error', summary: value.message, detail: '' });

        }
      }).finally(() => {
      })
        .subscribe(
          (value: Customer) => {
            if (value) {

              if (value.hasOwnProperty('success') && !value.success) {
                this.messageService.add({ severity: 'error', summary: value.message, detail: '' });
              } else {
                this.emailHeaderImage = null;
                this.emailHeaderImageUrl = "";
                this.init()
                this.messageService.add({ severity: 'info', summary: value.message, detail: '' });
              }
            }
          });
    }
  }

  private getContentObs(): Observable<any> {
    let contentObs: Observable<any>;
    contentObs = this.service.addCustomerEmailSettings(FormGroupUtils.extractValue(this.fg, this.customer))
    return contentObs;
  }

  private getImageObservables(): Observable<any> {
    const input = [];
    if (this.emailHeaderImage) {
      const formData: FormData = new FormData();
      formData.append('emailHeaderImage_aws_info', this.emailHeaderImage);
      input.push(this.service.updateEmailHeaderImage(formData));
    }

    input.push(Observable.of(''));

    return Observable.concat(...input);
  }
}
