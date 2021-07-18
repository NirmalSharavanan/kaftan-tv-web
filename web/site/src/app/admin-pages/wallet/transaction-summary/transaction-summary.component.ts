import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as jsPDF from 'jspdf';
import "jspdf-autotable";
import { WalletService } from 'app/services/wallet.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ss-transaction-summary',
  templateUrl: './transaction-summary.component.html',
  styleUrls: ['./transaction-summary.component.scss']
})
export class TransactionSummaryComponent implements OnInit {
  cols: any[];
  fg: FormGroup;
  columns: any[];
  transactionSummary: any;
  topupWallet: string;
  mobileRecharge: string;
  billPayment: string;
  bankTransfer: string;
  chargeAmount: any[];


  constructor(fb: FormBuilder, private service: WalletService,
    private datepipe: DatePipe) {
    var date = new Date();
    this.fg = fb.group({
      from_date: fb.control(new Date(date.getFullYear(), date.getMonth(), 1), [Validators.required]),
      to_date: fb.control(new Date(), []),
    });
  }

  ngOnInit() {
    this.cols = [
      { field: 'transactionDate', header: 'Transaction Date', width: '20%' },
      { field: 'totalwalletAmount', header: 'Wallet Load Amount', width: '20%' },
      { field: 'totalrechargeAmount', header: 'Total Recharge Amount', width: '20%' },
      { field: 'totalrechargeCommission', header: 'Total Recharge Commission', width: '20%' },
      { field: 'totalbillAmount', header: 'Total Bill Amount', width: '20%' },
      { field: 'totalbillCommission', header: 'Total Bill Commission', width: '20%' },
      { field: 'totaltransactionAmount', header: 'Total Transaction Amount', width: '20%' },
      { field: 'totaltransactionCommission', header: 'Total Transaction Commission', width: '20%' },
      { field: 'totalNowNowCommisssion', header: 'Total Kaftan Commission', width: '20%' },
      { field: 'totalbillerCommission', header: 'Total Biller Commission', width: '20%' },
    ]
    if (this.cols != null) {
      this.columns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));

    }
    this.searchTransactionSummary();
  }

  get from_date() {
    return this.fg.get('from_date').value;
  }

  get to_date() {
    return this.fg.get('to_date').value;
  }

  searchTransactionSummary() {
    this.service.getTransactionSummary(this.from_date, this.to_date).subscribe((response: any) => {
      if (response) {
        this.transactionSummary = response;
        this.transactionSummary = this.transactionSummary.map(x => ({
          transactionDate: x.transactionDate, 
          totalwalletAmount: this.getTotalAmount(x.walletTransactionHistoryList, 'Top-up Wallet'), 
          totalrechargeAmount: this.getTotalAmount(x.walletTransactionHistoryList, 'Mobile Top-up'),
          totalrechargeCommission: this.getTotalCommission(x.walletTransactionHistoryList, 'Mobile Top-up'),
          totalbillAmount: this.getTotalAmount(x.walletTransactionHistoryList, 'Bill Payment'),
          totalbillCommission: this.getTotalCommission(x.walletTransactionHistoryList, 'Bill Payment'), 
          totaltransactionAmount: this.getTotalAmount(x.walletTransactionHistoryList, 'Money Transfer'),
          totaltransactionCommission: this.getTotalCommission(x.walletTransactionHistoryList, 'Money Transfer'), 
          totalNowNowCommisssion: x.totalCommission,
          totalbillerCommission: this.getBillerChargeAmount(x.walletTransactionHistoryList, 'Bill Payment'), 
        }));
      }
    });
  }

  getTotalAmount(transactionHistoryList, transactionType) {
    var totalAmount;
    if (transactionType == 'Top-up Wallet') {
      var topupwallet = transactionHistoryList.filter(x => x.transactionType == transactionType);
      if (topupwallet != null && topupwallet.length > 0) {
        totalAmount = topupwallet[0].totalAmount;
      }
      else {
        totalAmount = "0";
      }
    }
    if (transactionType == 'Mobile Top-up') {
      var topupwallet = transactionHistoryList.filter(x => x.transactionType == transactionType);
      if (topupwallet != null && topupwallet.length > 0) {
        totalAmount = topupwallet[0].totalAmount;

      }
      else {
        totalAmount = "0";
      }
    }
    if (transactionType == 'Bill Payment') {
      var topupwallet = transactionHistoryList.filter(x => x.transactionType == transactionType);
      if (topupwallet != null && topupwallet.length > 0) {
        totalAmount = topupwallet[0].totalAmount;
      }
      else {
        totalAmount = "0";
      }
    }
    if (transactionType == 'Money Transfer') {
      var topupwallet = transactionHistoryList.filter(x => x.transactionType == transactionType);
      if (topupwallet != null && topupwallet.length > 0) {
        totalAmount = topupwallet[0].totalAmount;
      }
      else {
        totalAmount = "0";
      }
    }
    return totalAmount;
  }

  getTotalCommission(transactionHistoryList, transactionType) {
    var totalCommission;
    if (transactionType == 'Top-up Wallet') {
      var topupwallet = transactionHistoryList.filter(x => x.transactionType == transactionType);
      if (topupwallet != null && topupwallet.length > 0) {
        totalCommission = topupwallet[0].commission;
      }
      else {
        totalCommission = "0";
      }
    }
    if (transactionType == 'Mobile Top-up') {
      var topupwallet = transactionHistoryList.filter(x => x.transactionType == transactionType);
      if (topupwallet != null && topupwallet.length > 0) {
        totalCommission = topupwallet[0].commission;

      }
      else {
        totalCommission = "0";
      }
    }
    if (transactionType == 'Bill Payment') {
      var topupwallet = transactionHistoryList.filter(x => x.transactionType == transactionType);
      if (topupwallet != null && topupwallet.length > 0) {
        totalCommission = topupwallet[0].commission;
      }
      else {
        totalCommission = "0";
      }
    }
    if (transactionType == 'Money Transfer') {
      var topupwallet = transactionHistoryList.filter(x => x.transactionType == transactionType);
      if (topupwallet != null && topupwallet.length > 0) {
        totalCommission = topupwallet[0].commission;
      }
      else {
        totalCommission = "0";
      }
    }
    return totalCommission;
  }

  getBillerChargeAmount(transactionHistoryList, transactionType) {
    var chargeAmount;
    
    if (transactionType == 'Bill Payment') {
      var topupwallet = transactionHistoryList.filter(x => x.transactionType == transactionType);
      if (topupwallet != null && topupwallet.length > 0) {
        chargeAmount = topupwallet[0].chargeAmount;
      }
      else {
        chargeAmount = "0";
      }
    }
    return chargeAmount;
  }


  exportPdf() {
    const doc = new jsPDF();
    doc.autoTable(this.columns, this.transactionSummary);
    doc.save('Transaction_Summary.pdf');
  }
}
