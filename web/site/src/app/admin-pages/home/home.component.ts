import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/services/user.service';
import { ContentService } from 'app/services/content.service';
import { Content } from 'aws-sdk/clients/codecommit';
import { Category } from 'app/models/Category';
import { CategoryService, CategoryType } from 'app/services/category.service';
import { AWSContentUsage } from 'app/models/awsContentUsage';
import * as Highcharts from 'highcharts';
import { BlogService } from 'app/services/blog.service';
import { Blog } from 'app/models/Blog';

@Component({
  selector: 'ms-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  totalSignedupUsers: number;
  totalVideoContent: number;
  totalAudioContent: number;
  totalRadioList: number;
  totalChannels: number;
  videocontents: AWSContentUsage[];
  fromDate: Date;
  public options: any;
  public data: any;
  blogs: number;

  constructor(private userservice: UserService, private service: ContentService, private categoryService: CategoryService,
    private blogService: BlogService) { }

  ngOnInit() {

    const date = new Date();
    this.userservice.getContentUsageHistoryByMovie(date, date, false).subscribe((response: AWSContentUsage[]) => {

      if (response) {
        this.videocontents = response.filter(x => x.content.content_type == 'video');
        const receivedData = this.videocontents;

        this.options = {
          chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
          },
          title: {
            text: 'Top Most Watching Videos'
          },
          legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
          },
          tooltip: {
               pointFormat: '{series.name}'
           },
          plotOptions: {
            pie: {
              allowPointSelect: true,
              cursor: 'pointer',
              dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>'
              }
            }
          },
          series: []
        }

        var newseries;
        newseries = {};
        var DataSeries = [];
        const onlyFiveData = receivedData.slice(0, 5);
        var newData;
        for (var i = 0; i < onlyFiveData.length; i++) {
          newData = {};
          var dataUsed = this.formatBytes(receivedData[i].totalBytesDownloaded, 2);

          newData.name = receivedData[i].contentTitle + ": " + dataUsed;
          newData.y = receivedData[i].totalBytesDownloaded;
          DataSeries.push(newData);
        }

        newseries.name = '';
        newseries.data = DataSeries;
        this.options.series.push(newseries);
        Highcharts.chart('chartContainer', this.options);
      }
    });



    // Get signup users
    this.userservice.getSignupUsers()
      .subscribe((response: any) => {
        if (response) {
          this.totalSignedupUsers = response.length;
        }
      });

    this.service.getAllContents("video")
      .subscribe((outcome: Content[]) => {
        if (outcome) {
          this.totalVideoContent = outcome.length;
        }
      });

    this.service.getAllContents("audio")
      .subscribe((outcome: Content[]) => {
        if (outcome) {
          this.totalAudioContent = outcome.length;
        }
      });

    this.categoryService.getAllCategories(CategoryType.Radio, true)
      .subscribe((outcome: Category[]) => {
        if (outcome) {
          this.totalRadioList = outcome.length;
        }
      });

    this.categoryService.getAllCategories(CategoryType.Channel, true)
      .subscribe((outcome: Category[]) => {
        if (outcome) {
          this.totalChannels = outcome.length;
        }
      });

    this.blogService.getAllBlogs(true)
      .subscribe((blog: Blog[]) => {
        if (blog) {
          this.blogs = blog.length;
        }
      });
  }

  formatBytes(a, b) {
    if (0 == a) return "0 Bytes";
    var c = 1024, d = b || 2, e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"], f = Math.floor(Math.log(a) / Math.log(c));
    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f];
  }
}
