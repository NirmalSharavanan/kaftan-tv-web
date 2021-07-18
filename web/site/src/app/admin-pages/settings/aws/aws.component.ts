import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormGroupUtils } from './../../../common/utils/form-group-utils';
import { MessageService } from 'primeng/components/common/messageservice';
import { CustomerService } from './../../../services/customer.service';
import { Customer } from './../../../models/customer';

@Component({
  selector: 'ss-aws',
  templateUrl: './aws.component.html',
  styleUrls: ['./aws.component.scss']
})
export class AwsComponent implements OnInit {

  fg: FormGroup;
  customer: Customer[];

  constructor(fb: FormBuilder,
    private messageService: MessageService, private service: CustomerService) {

    this.fg = fb.group({
      aws_access_key: fb.control('', Validators.required),
      aws_secret_access_key: fb.control('', Validators.required),
      aws_region: fb.control('', Validators.required),
      aws_bucket: fb.control('', Validators.required),
      aws_identityPoolId: fb.control('', Validators.required)
    });
  }

  private init() {
    this.service.getCustomerForAdmin()
      .subscribe((customer: Customer[]) => {
        if (customer) {
          this.customer = customer;
          FormGroupUtils.applyValue(this.fg, customer);
        }
      });
  }

  ngOnInit() {
    this.init()
  }

  onSubmit() {
    this.service.addCustomerAWSSettings(FormGroupUtils.extractValue(this.fg, this.customer))
      .subscribe((value: Customer) => {
        if (value.success) {
          this.messageService.add({ severity: 'info', summary: 'AWS settings updated successfully!', detail: '' });
        }
        else {
          this.messageService.add({ severity: 'error', summary: value.message, detail: '' });
        }
      });
  }

}
