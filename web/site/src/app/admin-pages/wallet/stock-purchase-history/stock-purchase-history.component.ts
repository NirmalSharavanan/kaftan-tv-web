import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WalletStockPurchase } from 'app/models/WalletStockPurchase';
import { WalletService } from 'app/services/wallet.service';
import { WalletOperators } from 'app/models/WalletOperators';
import { DatePipe } from '@angular/common';
import * as jsPDF from 'jspdf';
import "jspdf-autotable";

@Component({
  selector: 'ss-stock-purchase-history',
  templateUrl: './stock-purchase-history.component.html',
  styleUrls: ['./stock-purchase-history.component.scss']
})
export class StockPurchaseHistoryComponent implements OnInit {

  fg: FormGroup;
  walletStocks: any[];
  walletOperators: WalletOperators[];
  cols: any[];
  fromDate: Date;
  toDate: Date;
  columns: any[];

  constructor(fb: FormBuilder, private datepipe: DatePipe,
    private service: WalletService) {
    var date = new Date();
    this.fg = fb.group({
      from_date: fb.control(new Date(date.getFullYear(), date.getMonth(), 1), [Validators.required]),
      to_date: fb.control(new Date(), []),
      operatorId: fb.control('All', [])
    })
  }

  ngOnInit() {
    this.service.getAllOperators().subscribe((operators: WalletOperators[]) => {
      if (operators) {
        this.walletOperators = operators.filter(x => x.serviceType !== 0);
      }
    });
    this.getWalletStocks();

    this.cols = [
      { field: 'operatorName', header: 'Operator Name', width: '20%' },
      { field: 'created_at', header: 'Purchase Date', width: '20%' },
      { field: 'purchaseCost', header: 'Purchase Cost', width: '20%' },
      { field: 'purchaseAmount', header: 'Purchase Amount', width: '20%' },
    ]

    this.columns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
  }

  get operatorId() {
    return this.fg.get('operatorId').value;
  }

  get from_date() {
    return this.fg.get('from_date').value;
  }

  get to_date() {
    return this.fg.get('to_date').value;
  }

  getWalletStocks() {
    if (this.operatorId) {
      this.service.getWalletStocks(this.operatorId, this.from_date, this.to_date).subscribe((response: WalletStockPurchase[]) => {
        if (response) {
          this.walletStocks = response;
          this.walletStocks = this.walletStocks.map(x => ({
            operatorName: x.serviceInfo.operatorName,
            created_at: this.datepipe.transform(x.created_at, 'dd-MM-yyyy'), purchaseCost: x.purchaseCost, purchaseAmount: x.purchaseAmount
          }));
        }
      });
    } else {

      this.service.getWalletStocks("All", this.from_date, this.to_date).subscribe((response: WalletStockPurchase[]) => {
        if (response) {
          this.walletStocks = response;
        }
      });
    }
  }

  onSearch() {
    this.getWalletStocks();
  }

  exportPdf() {
        const doc = new jsPDF();
        doc.autoTable(this.columns, this.walletStocks);
        doc.save('Operator_Biller_StockPurchaseReport.pdf');
  }
}
