import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { AWSContentUsage } from './../../../models/awsContentUsage';

@Component({
  selector: 'ss-content-usage-by-movie',
  templateUrl: './content-usage-by-movie.component.html',
  styleUrls: ['./content-usage-by-movie.component.scss']
})
export class ContentUsageByMovieComponent implements OnInit {
  fg: FormGroup;
  contentusagebymovie: AWSContentUsage[];
  cols: any[];
  searchByDate: boolean;
  fromDate: Date;
  toDate: Date;

  constructor(fb: FormBuilder,
    private service: UserService) {
    var date = new Date();
    this.fg = fb.group({
      from_date: fb.control(new Date(date.getFullYear(), date.getMonth(), 1), [Validators.required]),
      to_date: fb.control(new Date(), [Validators.required]),
    })
  }

  ngOnInit() {
    this.getContentUsageHistoryByMovie();
  }

  getContentUsageHistoryByMovie() {
    this.searchByDate = false;
    this.service.getContentUsageHistoryByMovie(this.fg.get('from_date').value, this.fg.get('to_date').value, this.searchByDate).subscribe((response: AWSContentUsage[]) => {
      if (response) {
        this.contentusagebymovie = response;
        this.contentusagebymovie.filter(user =>
          user.totalBytesDownloaded = this.formatBytes(user.totalBytesDownloaded, 2)
        );
        this.cols = [
          { field: 'contentTitle', header: 'Content Name', width: '30%' },
          { field: 'totalBytesDownloaded', header: 'Bandwidth Usage', width: '20%' },
        ];
      }
    });
  }

  onSearch() {
    this.searchByDate = true;
    this.fromDate = this.fg.get('from_date').value;
    this.toDate = this.fg.get('to_date').value;
    this.toDate.setDate(this.toDate.getDate() + 1); //incrementing 1 day from 'To date' to check if 'To date' and 'accessed_datetime' in content usage history table are same.

    this.service.getContentUsageHistoryByMovie(this.fromDate, this.toDate, this.searchByDate).subscribe((response: AWSContentUsage[]) => {
      if (response) {
        this.contentusagebymovie = response;
        this.contentusagebymovie.filter(user =>
          user.totalBytesDownloaded = this.formatBytes(user.totalBytesDownloaded, 2)
        );
      }
    })
    this.toDate.setDate(this.toDate.getDate() - 1);

  }

  getBandWidth(value) {

    // 1024kb = 1048576

    var bandwidth;
    if (value == 1048576) {
      bandwidth = "1 MB"
    }
    if (value > 1048576) {
      bandwidth = Math.round(value / 1024 / 1024);
      if (bandwidth >= 1024) {
        bandwidth = Math.round(bandwidth / 1024) + " GB";
      }
      else {
        bandwidth = bandwidth + " MB";
      }
    }
    else {
      bandwidth = Math.round(value / 1024);
      if (bandwidth >= 1) {
        bandwidth = bandwidth + " KB";
      }
      else {
        bandwidth = value + " BYTES";
      }
    }

    return bandwidth;
  }

  formatBytes(a, b) {
    if (0 == a) return "0 Bytes";
    var c = 1024, d = b || 2, e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"], f = Math.floor(Math.log(a) / Math.log(c));
    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f];
  }
}
