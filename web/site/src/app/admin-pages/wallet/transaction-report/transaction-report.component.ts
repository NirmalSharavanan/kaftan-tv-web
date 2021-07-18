import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { WalletOperators } from 'app/models/WalletOperators';
import { WalletService } from 'app/services/wallet.service';
import * as jsPDF from 'jspdf';
import "jspdf-autotable";
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ss-transaction-report',
  templateUrl: './transaction-report.component.html',
  styleUrls: ['./transaction-report.component.scss']
})
export class TransactionReportComponent implements OnInit {

  fg: FormGroup;
  walletOperators: WalletOperators[];
  servicetypeid: number;
  transactionReports: any[];
  columns: any[];
  cols: any[];
  serviceType: string;
  id: number;
  display: boolean;
  columnCount: number;
  indexCount: number = 1;

  constructor(fb: FormBuilder, private datepipe: DatePipe,
    private service: WalletService) {
    var date = new Date();
    this.fg = fb.group({
      serviceType: fb.control(0, []),
      operatorId: fb.control('All', []),
      from_date: fb.control(new Date(date.getFullYear(), date.getMonth(), 1), [Validators.required]),
      to_date: fb.control(new Date(), []),
    });
  }

  ngOnInit() {
    this.cols = [
      { id: '1', field: 'indexCount', header: 'S. No.', display: true },
      { id: '2', field: 'name', header: 'Customer Name', display: true },
      { id: '3', field: 'mobileNo', header: 'Customer Mobile No.', display: true },
      { id: '4', field: 'created_at', header: 'Transaction Date', display: true },
      { id: '5', field: 'paymentAmount', header: 'Transaction Amount', display: true },
      { id: '6', field: 'operatorName', header: 'Operator/Biller Name', display: true },
    ]
    if (this.cols != null) {
      this.columns = this.cols.map(col => ({ title: col.header, dataKey: col.field, id: col.id, display: col.display }));
      this.columnCount = this.columns.length;
    }
    this.searchTransactionReports();
  }

  myFunction() {
    var x = document.getElementById("myDIV");
    if (x.style.display === "block") {
      x.style.display = "none";
    } else {
      x.style.display = "block";
    }
  }

  checkValue(event, cols ) {
      this.columnCount = 0;
      this.cols.forEach((column: any) => {
        if (column.id === cols.id) {
          column.display = event.target.checked;
        }
        if(column.display) {
          this.columnCount++;
        }
      });
  }

  get servicetype() {
    return this.fg.get('serviceType').value;
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

  onChangeTransactiontype(event) {
    if (this.operatorId != "All" && this.operatorId == "") {
      this.fg.get('operatorId').setValue("");
    }
    if (event.target.value > 0) {
      var serviceType = event.target.value;
      this.servicetypeid = serviceType
      if (this.servicetypeid) {
        this.service.getOperatorsByService(this.servicetypeid).subscribe((operators: WalletOperators[]) => {
          if (operators && operators.length > 0) {
            this.walletOperators = operators;
          }
        });
      } 
    }
    else {
      this.walletOperators= [];
      this.fg.get('operatorId').setValue("All");
    }
  }

  exportPdf() {
    const doc = new jsPDF();
    doc.autoTable(this.columns, this.transactionReports);
    doc.save('TransactionReport.pdf');
  }

  searchTransactionReports() {
    this.indexCount = 1;
      this.service.getTransactionReport(this.servicetype, this.operatorId, this.from_date, this.to_date).subscribe((response: any[]) => {
        if (response) {
          this.transactionReports = response;
          this.transactionReports = this.transactionReports.map(x => ({
            name: x.userInfo.name, mobileNo: x.userInfo.mobileNo,
            operatorName: x.serviceInfo.operatorName,
            paymentAmount: x.totalAmount,
            created_at: this.datepipe.transform(x.created_at, 'dd-MM-yyyy'),
            indexCount: this.indexCount++
          }));
        }
      }); 
  }
}
