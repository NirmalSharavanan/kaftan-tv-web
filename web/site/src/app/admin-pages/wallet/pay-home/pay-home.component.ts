import { Component, OnInit } from '@angular/core';
import { WalletService } from 'app/services/wallet.service';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'ss-pay-home',
  templateUrl: './pay-home.component.html',
  styleUrls: ['./pay-home.component.scss']
})
export class PayHomeComponent implements OnInit {

  subscriberList: any;
  totalSubscribers: number;
  totalactiveSubscribers: number;
  totalTransactionHistory: number;
  allTransactionreport: any;
  allWalletDetails: any;
  totalTransactionAmount: number;
  public options: any;
  public subscriberOptions: any;

  constructor(private service: WalletService, private datepipe: DatePipe) { }

  ngOnInit() {

    this.service.getAllTransactionReport().subscribe((transactionreport: any) => {
      if (transactionreport && transactionreport.length > 0) {
        this.allTransactionreport = transactionreport;
        if (transactionreport.length > 0) {
          this.drawGraphTransaction(this.allTransactionreport);
        }
      }
    })

    this.service.getAllTransactionHistory().subscribe((walletDetails: any) => {
      if (walletDetails) {
        this.allWalletDetails = walletDetails;
        this.totalTransactionHistory = this.allWalletDetails.walletTransactionHistory.length;
        this.totalSubscribers = this.allWalletDetails.walletUsers.length;
        this.totalTransactionAmount = this.allWalletDetails.walletTransactionHistory.reduce((sum, item) => sum + item.totalAmount, 0);
        this.allWalletDetails = this.allWalletDetails.walletUsers.map(x => ({
          activeSubscribers: this.loginDaysCount(x.lastLoginAt) < 10 || this.subscriptionDaysCount(x.subscriptionDate) > 0,
        }));
        this.totalactiveSubscribers= this.allWalletDetails.length;
      }
    })

    this.service.getAllSubscribersbyMonth().subscribe((subscribers: any) => {
      if (subscribers && subscribers.length > 0) {
        this.subscriberList = subscribers;
        if (subscribers.length > 0) {
          this.drawGraphRegisteredSubscriber(this.subscriberList);
        }
      }
    })
  }

  drawGraphTransaction(transDetails) {
    if (transDetails != null) {
      this.options = {
        chart: {
          type: 'column'
        },
        title: {
          text: 'KAFTAN PAY Services'
        },
        xAxis: {
          categories: [
          ],
          crosshair: false
        },
        yAxis: {
          min: 0
        },
        tooltip: {
          headerFormat: '<span style="font-size:12px">{point.key}</span><table>',
          pointFormat: '<tr><td style="color:{series.color};padding:0"><b>{series.name}</b>: </td>' +
            '<td style="padding:0"><b>{point.y}</b></td></tr>',
          footerFormat: '</table>',
          shared: true,
          useHTML: true
        },
        plotOptions: {
          column: {
            pointPadding: 0.2,
            borderWidth: 0
          }
        },
        series: [],
        colors: [
          '#2b83a5',
          '#ea7b1b'
        ]
      }
      var Amtnewseries;
      Amtnewseries = {};
      var CntSeries;
      CntSeries = {};
      var totAmount = [];
      var cntTotal = [];
      for (var i = 0; i < transDetails.length; i++) {
        this.options.xAxis.categories.push(transDetails[i].transactionType);
        totAmount.push(transDetails[i].totalAmount);
        cntTotal.push(transDetails[i].walletTransactionHistoryList.length);
      }

      Amtnewseries.name = 'Amount';
      Amtnewseries.data = totAmount;
      this.options.series.push(Amtnewseries);

      CntSeries.name = 'Count';
      CntSeries.data = cntTotal;
      this.options.series.push(CntSeries);

      Highcharts.chart('PayServiceChartContainer', this.options);
    }
  }

  drawGraphRegisteredSubscriber(subscriberList) {
    if (subscriberList != null) {
      this.subscriberOptions = {
        chart: {
          type: 'column'
        },
        title: {
          text: 'Registered Subscribers'
        },

        xAxis: {
          type: 'category',
          labels: {
            rotation: -45,
            style: {
              fontSize: '13px',
              fontFamily: 'Verdana, sans-serif'
            }
          }
        },
        yAxis: {
          min: 0,
          title: {
            text: ''
          }
        },
        legend: {
          enabled: false
        },
        tooltip: {
          pointFormat: 'Subscriber Count in 2019: <b>{point.y}</b>'
        },
        series: []
      }
      var newseries;
      newseries = {};
      var DataSeries = [];

      var dataLabelAny;
      dataLabelAny = {};
      var dataLabelStyleAny;
      dataLabelStyleAny = {};

      dataLabelStyleAny.fontSize = '13px';
      dataLabelStyleAny.fontFamily = 'Verdana, sans-serif';

      dataLabelAny.enabled = true;
      dataLabelAny.rotation = -90;
      dataLabelAny.color = '#FFFFFF';
      dataLabelAny.align = 'right';
      dataLabelAny.format = '{point.y}';
      dataLabelAny.y = 10;
      dataLabelAny.style = dataLabelStyleAny;

      for (var j = 0; j < subscriberList.length; j++) {
        DataSeries.push(subscriberList[j]);
      }
      
      newseries.name = 'Subscriber Count';
      newseries.data = DataSeries;
      newseries.dataLabels = dataLabelAny;
      this.subscriberOptions.series.push(newseries);
      Highcharts.chart('RegisteredSubscriberChartContainer', this.subscriberOptions);
    }
  }

  loginDaysCount(date) {
    var newDate = this.datepipe.transform(new Date(), "yyyy/MM/dd");
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
}
