import { VideoPlayWrapper } from './../../../models/VideoPlayWrapper';
import { UserService } from './../../../services/user.service';
import { Router } from '@angular/router';
import { AuthenticationService } from './../../../services/authentication.service';
import { ContentService } from './../../../services/content.service';
import { Content } from './../../../models/content';
import { PlayContent } from './../../../models/playContent';
import { AWSInfo } from './../../../models/awsInfo';
import { Component, OnInit, Input, EventEmitter, Output, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'ss-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {

  @Input()
  content: Content;

  @Output() playClicked: EventEmitter<boolean>;

  playVideo: boolean;
  awsInfo: AWSInfo;
  isAuthenticated: boolean;
  has_access_to_preminum: boolean;
  premium_message: string;
  price: number;

  constructor(private router: Router, private service: ContentService,
    private authService: AuthenticationService,
    private userService: UserService) {
      this.playClicked = new EventEmitter();
    }

  ngOnInit() {
    this.init();
  }

  init() {
    this.price = 0;

    this.authService.isUserAuthenticated()
      .subscribe((isAuth: boolean) => {
        this.isAuthenticated = isAuth;

        this.service.getPrice(this.content)
          .subscribe((price) => {
            this.price = price;
          });
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.content.previousValue != null && changes.content.previousValue.id !== changes.content.currentValue.id) {
      this.init();
    }
  }

  play() {
    this.authService.isUserAuthenticated()
      .subscribe((isAuth: boolean) => {
        this.isAuthenticated = isAuth;

        if (this.isAuthenticated) {
          this.awsInfo = new AWSInfo();
          this.getVideoUrl();
        } else {
          this.playVideo = true;
        }

      });
  }

  cancelPlay() {
    this.playVideo = false;
    return false;
  }

  getIsInvalidUser() {
    if (!this.isAuthenticated) {
      return true;
    } else if (this.isAuthenticated && this.content.is_premium && !this.has_access_to_preminum) {
      return true;
    } else {
      return false;
    }
  }

  getVideoUrl() {

    this.service.getContentToWatch(this.content.id, false)
      .subscribe((response: VideoPlayWrapper) => {
        if (response) {
          if (response.success) {
            if (this.content.is_premium) {
              this.has_access_to_preminum = true;
            }
            this.playClicked.emit(true);
          } else {
            if (this.content.is_premium) {
              this.premium_message = response.message;
              this.has_access_to_preminum = false;
            }
            this.playVideo = true;
          }
        }
      });

  }

  onPaymentStatusChange($event) {
    if ($event) {

      this.userService.reloadUserInfo();

      // console.log("payment status updated");
      // console.log($event);

      this.service.getPrice(this.content)
        .subscribe((price) => {
          // console.log(price)
          this.price = price;
        });
    }
  }

  cancel() {
    this.playVideo = false;
  }
}
