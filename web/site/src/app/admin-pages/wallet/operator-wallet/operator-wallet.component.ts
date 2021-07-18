import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { WalletService } from './../../../services/wallet.service';
import { WalletOperators } from 'app/models/WalletOperators';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
  selector: 'ss-operator-wallet',
  templateUrl: './operator-wallet.component.html',
  styleUrls: ['./operator-wallet.component.scss']
})
export class OperatorWalletComponent implements OnInit {

  fg: FormGroup;
  walletCategories: WalletOperators[];
  walletOperators: WalletOperators[];
  operator: WalletOperators;
  servicetypeid: number;
  serviceName: string;
  categoryId: number;
  categoryName: string;
  emailPattern = "[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}";

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private service: WalletService) {
    this.fg = fb.group({
      serviceType: fb.control('', [Validators.required]),
      operatorId: fb.control('', [Validators.required]),
      operatorName: fb.control('', []),
      purchaseCost: fb.control('', [Validators.required]),
      purchaseAmount: fb.control('', [Validators.required]),
      registerMacing: fb.control('', []),
      'stockAlerts': fb.array([])
    });
  }

  get stockAlerts() {
    return this.fg.get('stockAlerts') as FormArray;
  }

  private createAlert() {
    return this.fb.group(
      {
        name: this.fb.control('', [Validators.required]),
        mobileNo: this.fb.control('', [Validators.required]),
        emailId: this.fb.control('', [Validators.required, Validators.pattern(this.emailPattern)]),
        thresholdAmount: this.fb.control('', [Validators.required]),
      });
  }

  stringify(o: WalletOperators): string {
    return JSON.stringify(o);
  }

  ngOnInit() {
    this.getCategories();
    this.stockAlerts.push(this.createAlert());
  }

  get operatorId() {
    return this.fg.get('operatorId').value;
  }

  get serviceType() {
    return this.fg.get('serviceType').value;
  }

  get purchaseAmount() {
    return this.fg.get('purchaseAmount').value;
  }

  get operatorName() {
    return this.fg.get('operatorName').value;
  }

  get name() {
    return this.fg.get('name').value;
  }

  get mobileNo() {
    return this.fg.get('mobileNo').value;
  }

  get emailId() {
    return this.fg.get('emailId').value;
  }

  get thresholdAmount() {
    return this.fg.get('thresholdAmount').value;
  }

  getCategories() {
    var uniq = {};
    var uniqBiller = {};

    this.service.getAllOperators().subscribe((operators: WalletOperators[]) => {
      if (operators && operators.length > 0) {
        var walletServices = [];
        var nonBillers = operators.filter(obj => (!uniq[obj.serviceType] && (uniq[obj.serviceType] = true) && obj.name != 'Bill Payment') ||
          !uniq[obj.categoryId] && (uniq[obj.categoryId] = true));

        var billers = operators.filter(obj => obj.name == 'Bill Payment' && !uniqBiller[obj.categoryId] && (uniqBiller[obj.categoryId] = true));
        if (billers && billers.length > 0) {
          walletServices = nonBillers.concat(billers);
        }

        var categories = walletServices.filter(x => x.operatorName != 'Service');
        this.walletCategories = categories;
      }
    });
  }

  onChangeCategory(event) {
    if (this.operatorId) {
      this.fg.get('operatorId').setValue("");
    }
    if (event.target.value != '') {
      this.operator = JSON.parse("" + event.target.value + "");
      if (this.operator.categoryId != 0) {
        this.serviceName = "Bill Payment";
        this.categoryId = this.operator.categoryId;
        this.categoryName = this.operator.categoryName;

      } else {

        this.serviceName = this.operator.name;
        this.categoryId = 0;
        this.categoryName = "";
      }
      this.servicetypeid = this.operator.serviceType;
      if (this.servicetypeid) {

        this.service.getOperatorsByService(this.servicetypeid).subscribe((operators: WalletOperators[]) => {
          if (operators && operators.length > 0) {
            if (this.servicetypeid === 3) {
              this.walletOperators = operators.filter(x => Number(x.operatorCode) != 2);
            } else if (this.servicetypeid === 2 && this.operator) {
              this.walletOperators = operators.filter(x => x.categoryId === this.operator.categoryId);
            }else {
              this.walletOperators = operators;
            }
          }
        });
      }
    }
  }

  onChangeOperator(event) {
    if (event.target.value != '') {
      this.operator = JSON.parse("" + event.target.value + "");
      this.fg.get('operatorName').setValue(this.operator.operatorName);
      this.service.getThresholdAlerts(this.operator.id).subscribe((response: any) => {
        this.stockAlerts.controls = [];

        if (response && response.length > 0) {
          response.forEach((value: any) => {
            const stockAlertGroup = this.fb.group(
              {
                id: this.fb.control(value.id, []),
                name: this.fb.control(value.name, [Validators.required]),
                mobileNo: this.fb.control(value.mobileNo, [Validators.required]),
                emailId: this.fb.control(value.emailId, [Validators.required]),
                thresholdAmount: this.fb.control(value.thresholdAmount, [Validators.required]),
              });
            this.stockAlerts.push(stockAlertGroup);
          });
        } else {
          +          this.stockAlerts.push(this.createAlert());
        }
      });
    }
  }

  createWalletStock() {
    this.registerWalletStock();
  }

  registerWalletStock() {
    if (this.operator) {
      var regEncryptValue = {
        "bankCode": "KAFTON", "idValue": "GSM123456", "mobileNo": "9068989149"
      }
      this.service.registrationEncrypt(regEncryptValue).subscribe((response: any) => {
        if (response && response.Success) {
          this.fg.get('registerMacing').setValue(response.macing);
          this.fg.get('operatorId').setValue(this.operator.id);
          this.fg.get('serviceType').setValue(this.servicetypeid);
          this.service.createWalletStock(this.fg.value).subscribe((response: any) => {
            if (response && response.success) {

              this.service.createThresholdAlerts(this.operatorId, this.stockAlerts.value[0]).subscribe((response: any) => {
                if (response) {
                }
              });

              this.messageService.add({ severity: 'success', summary: this.operatorName + ' Purchased Successfully', detail: '' });
              this.fg.reset();
              this.clear()
            } else {
              this.messageService.add({ severity: 'error', summary: response.message, detail: '' });
            }
          });
        }
      });
    }
  }

  clear() {
    this.fg.get('serviceType').setValue("");
    this.fg.get('operatorId').setValue("");
  }

}