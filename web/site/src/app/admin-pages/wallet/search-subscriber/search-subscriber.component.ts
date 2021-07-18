import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { WalletService } from 'app/services/wallet.service';
import * as jsPDF from 'jspdf';
import "jspdf-autotable";
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'ss-search-subscriber',
  templateUrl: './search-subscriber.component.html',
  styleUrls: ['./search-subscriber.component.scss']
})
export class SearchSubscriberComponent implements OnInit {

  fg: FormGroup;
  isEmail: boolean;
  isMobileNumber: boolean;
  keyword: string;
  subscriber: any;
  lastWalletTopup: string;
  loading: boolean = false;
  subscriberList: any[];
  cols: any[];
  columns: any[];
  currentDates: Date;
  accountStatus: string;

  constructor(fb: FormBuilder, private datepipe: DatePipe,
    private service: WalletService) {
    this.fg = fb.group({
      isEmailRadio: fb.control('', []),
      email: fb.control('', []),
      mobileNo: fb.control('', [Validators.minLength(10)]),
    })
  }

  ngOnInit() {
    this.getSubscriberList();
  }

  getSubscriberList() {
    this.service.getAllSubscribers().subscribe((subscribers: any) => {
      if (subscribers && subscribers.length > 0) {
        this.subscriberList = subscribers;
        this.subscriberList = this.subscriberList.map(x => ({
          name: x.name, mobileNo: x.mobileNo, email: x.email,
          balance: x.walletInfo.balance,
          accountType: "Customer",
          created_at: this.convertDate(x.walletInfo.created_at),
          lastLogin_at: x.lastLoginAt,
          lastWalletTopUp: x.walletTransactionHistoryList != null && x.walletTransactionHistoryList[0].created_at != null ? this.getWalletTopupDate(x.walletTransactionHistoryList) : '-',
          txnDate: x.walletTransactionHistoryList != null && x.walletTransactionHistoryList[0].created_at != null ? this.getTxnDate(x.walletTransactionHistoryList) : '-',
          accountStatus: this.loginDaysCount(x.lastLoginAt) < 10 || this.subscriptionDaysCount(x.subscriptionDate) > 0 ? "Active" : "InActive",
        }));
        this.cols = [
          { field: 'name', header: 'Subscriber Name', width: '20%' },
          { field: 'mobileNo', header: 'Subscriber Mobile Number', width: '20%' },
          { field: 'created_at', header: 'Date Of Registration', width: '20%' },
          { field: 'accountType', header: 'Account Type', width: '20%' },
          { field: 'email', header: 'Email', width: '20%' },
          { field: 'balance', header: 'Wallet Balance', width: '20%' },
          { field: 'lastLogin_at', header: 'Last Login', width: '20%' },
          { field: 'txnDate', header: 'Last Txn. Date', width: '20%' },
          { field: 'lastWalletTopUp', header: 'Last Wallet Top-up', width: '20%' },
          { field: 'accountStatus', header: 'Account Status', width: '20%' },
        ]
        this.columns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
      }
    });
  }

  loginDaysCount(date) {
    var newDate = this.datepipe.transform(new Date(),"yyyy/MM/dd");
    var currentDate = moment(newDate);
    var lastLoginDate = moment(date);
    var daysCount = moment.duration(currentDate.diff(lastLoginDate)).asDays();
    return daysCount;
  }

  subscriptionDaysCount(date) {
    var newDate = this.datepipe.transform(new Date(), "yyyy/MM/dd");
    var currentDate = moment(newDate);
    var lastLoginDate = moment(date);
    var daysCount = moment.duration(lastLoginDate.diff(currentDate)).asDays();
    return daysCount;
  }

  convertDate(date) {
    if (date != null)
      var convertedDate = this.datepipe.transform(date, 'dd-MM-yyyy');
    return convertedDate;
  }

  getWalletTopupDate(walletTransactionHistoryList) {
    var convertedDate = '';
    if (walletTransactionHistoryList && walletTransactionHistoryList.length > 0) {
      var walletTransInfo = walletTransactionHistoryList.filter(x => x.transactionType != null && x.transactionType == "Top-up Wallet")
        .sort(function (a, b) { return b.created_at - a.created_at });

      if (walletTransInfo && walletTransInfo.length > 0) {
        convertedDate = this.datepipe.transform(walletTransInfo[0].created_at, 'dd-MM-yyyy');
      }
    }
    return convertedDate;
  }

  getTxnDate(walletTransactionHistoryList) {
    var convertedDate = '';
    if (walletTransactionHistoryList && walletTransactionHistoryList.length > 0) {
      var walletTransInfo = walletTransactionHistoryList.sort(function (a, b) { return b.created_at - a.created_at });

      if (walletTransInfo && walletTransInfo.length > 0) {
        convertedDate = this.datepipe.transform(walletTransInfo[0].created_at, 'dd-MM-yyyy');
      }
    }
    return convertedDate;
  }

  exportPdf() {
    const doc = new jsPDF();
    doc.autoTable(this.columns, this.subscriberList);
    doc.save('SubscriberReport.pdf');
  }

  get walletemail() {
    return this.fg.get('email');
  }

  get walletMobileNumber() {
    return this.fg.get('mobileNo');
  }

  onMobileNumberChange(event) {
    this.fg.get('isEmailRadio').setValue(false);
    this.isMobileNumber = true;
    this.isEmail = false;
    this.fg.get('email').setValue("");
    this.fg.controls['email'].setValidators([]);
    this.fg.get('email').updateValueAndValidity();
    this.subscriber = null;
  }

  onEmailChange(event) {
    this.fg.get('isEmailRadio').setValue(true);
    this.isEmail = true;
    this.isMobileNumber = false;
    this.fg.get('mobileNo').setValue("");
    this.fg.controls['mobileNo'].setValidators([]);
    this.fg.get('mobileNo').updateValueAndValidity();
    this.subscriber = null;
  }

  onSubmit() {
    this.subscriber = null;
    var mobilenumber = this.walletMobileNumber.value;
    if (mobilenumber) {
      mobilenumber = this.walletMobileNumber.value && this.walletMobileNumber.value.length > 1 ? this.walletMobileNumber.value.substr(1) : this.walletMobileNumber.value;
    }
    this.loading = true;
    if (this.walletemail.value != null && this.walletemail.value != "") {
      this.getSubscriber(this.walletemail.value, "");

    } else {
      this.getSubscriber("", mobilenumber);
    }
  }

  getSubscriber(email, mobilenumber) {

    var mobileorEmail = email != '' ? email : mobilenumber;
    if (mobileorEmail != '') {
      this.service.getSubscriber(mobileorEmail, this.isMobileNumber).subscribe((subscriber: any) => {
        if (subscriber) {
          this.subscriber = subscriber;
          this.lastWalletTopup = "";
          if (this.subscriber.length > 0) {
              var lastLogin = this.subscriber[0].lastLoginAt;
              var subscriptionDate = this.subscriber[0].subscriptionDate;
              this.accountStatus = this.loginDaysCount(lastLogin) < 10 || this.subscriptionDaysCount(subscriptionDate) > 0 ? "Active" : "InActive";
            var walletTransInfo = this.subscriber.filter(x => x.walletTransactionHistoryInfo != null && x.walletTransactionHistoryInfo.transactionType == "Top-up Wallet");
            if (walletTransInfo != null && walletTransInfo.length > 0) {
              this.lastWalletTopup = walletTransInfo[0].walletTransactionHistoryInfo.created_at;
            }
          }
        }
        this.loading = false;
      });
      this.loading = false;
    }
  }
}
