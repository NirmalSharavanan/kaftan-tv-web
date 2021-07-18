import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WalletOperators } from './../../../models/WalletOperators';
import { WalletService } from './../../../services/wallet.service';

@Component({
  selector: 'ss-app-menu',
  templateUrl: './app-menu.component.html',
  styleUrls: ['./app-menu.component.scss']
})
export class AppMenuComponent implements OnInit {
  fg: FormGroup;
  walletOperators: WalletOperators[];
  walletStaticServices = [];
  walletServices: any;
  operatorId: string;

  constructor(
    fb: FormBuilder,
    private service: WalletService
  ) {
    this.fg = fb.group({
      id: fb.control(''),
      name: fb.control(''),
      serviceType: fb.control(''),
      categoryId: fb.control(''),
      categoryCode: fb.control(''),
      categoryName: fb.control(''),
      operatorCode: fb.control(''),
      operatorName: fb.control(''),
      operatorImage: fb.control(''),
      active: fb.control('')
    });
  }

  ngOnInit() {
    this.staticServicesAssign();
  }

  staticServicesAssign() {

    let mobile = {
      name: "Mobile Recharge",
      serviceType: 0,
      categoryId: 0,
      categoryCode: 0,
      categoryName: "",
      operatorCode: "",
      operatorName: "",
      operatorImage: "",
    };
    let billPay = {
      name: "Bill Payment",
      serviceType: 0,
      categoryId: 0,
      categoryCode: 0,
      categoryName: "",
      operatorCode: "",
      operatorName: "",
      operatorImage: "",
    };
    let moneyTransfer = {
      name: "Money Transfer",
      serviceType: 0,
      categoryId: 0,
      categoryCode: 0,
      categoryName: "",
      operatorCode: "",
      operatorName: "",
    };
    let favourite = {
      name: "Favorites",
      serviceType: 0,
      categoryId: 0,
      categoryCode: 0,
      categoryName: "",
      operatorCode: "",
      operatorName: "",
      operatorImage: "",
    };
    let transHistory = {
      name: "Transaction History",
      serviceType: 0,
      categoryId: 0,
      categoryCode: 0,
      categoryName: "",
      operatorCode: "",
      operatorName: "",
      operatorImage: "",
    };

    this.walletStaticServices.push(mobile);
    this.walletStaticServices.push(billPay);
    this.walletStaticServices.push(moneyTransfer);
    this.walletStaticServices.push(favourite);
    this.walletStaticServices.push(transHistory);
    var uniq = {};
    this.service.createOperators(this.walletStaticServices).subscribe((response: WalletOperators) => {

      if (response.success) {

        var operators = this.service.getAllOperators().subscribe((operators: WalletOperators[]) => {
          if (operators) {
            this.walletOperators = operators;
            var walletServices = this.walletOperators.filter(obj => !uniq[obj.serviceType] && (uniq[obj.serviceType] = true));
            this.walletServices = walletServices.filter(obj => obj.serviceType !== 3);

          }
        });
      }
    });

  }

  onChangeOperator(event, operator) {
    if (operator) {
      this.operatorId = operator.id;
      if (event.currentTarget.checked) {
        this.fg.get('active').setValue(true);
      } else {
        this.fg.get('active').setValue(false);
      }
      this.updateOperator();
    }
  }

  updateOperator() {
    this.service.updateOperator(this.fg.value, this.operatorId).subscribe((response: WalletOperators) => {
      if (response.success) {
      }
    });
  }

}