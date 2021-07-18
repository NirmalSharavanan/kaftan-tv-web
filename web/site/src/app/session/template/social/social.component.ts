import { AfterViewInit, Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Content } from 'app/models/content';
import { Blog } from 'app/models/Blog';
import { AuthenticationService } from './../../../services/authentication.service';
import { UserService } from './../../../services/user.service';

declare var $: any;

@Component({
  selector: 'ss-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss']
})
export class SocialComponent implements OnInit, AfterViewInit, OnChanges {

  isAuthenticated: boolean;
  @Input() content: Content;
  @Input() blog: Blog;
  isFavorite: boolean;
  isInvalidUser: boolean;
  isContent: boolean;
  shareUrl: String;

  constructor(private authService: AuthenticationService, private service: UserService) { }

  ngOnInit() {
    this.init();
  }

  ngAfterViewInit() {
    this.paintSharebox();
  }

  private paintSharebox() {
    if ($('.my-share-box')) {
      const element: any = $('.my-share-box');
      element.children().remove();
      const mySpan = document.createElement('span');
      if(this.isContent) {
        this.shareUrl = document.location.origin + '/share?id%3D' + this.content.id + '%26isContent%3D'+true;
        $(mySpan).sharebox({
          url: document.location.origin + '/share?id=' + this.content.id +'&isContent='+true,
          title: this.content.title,
        });
      } else {
        this.shareUrl = document.location.origin + '/share?id%3D' + this.blog.id + '%26isContent%3D'+false;
        $(mySpan).sharebox({
          url: document.location.origin + '/share?id=' + this.blog.id +'&isContent='+false,
          title: this.blog.title,
        });
      }
      
      $('.my-share-box').append(mySpan);
    }
  }

  init() {

    if(this.content != undefined && this.content) {
      this.isContent = true;
    } else {
      this.isContent = false;
    }

    this.authService.isUserAuthenticated()
      .subscribe((isAuth: boolean) => {
        this.isAuthenticated = isAuth;

        if (this.isAuthenticated && this.isContent) {
          this.getFavorite();
        }

      });
      this.paintSharebox();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.isContent && changes.content.previousValue != null && changes.content.previousValue.id !== changes.content.currentValue.id) {
      this.init();
    }
  }

  getFavorite() {
    this.service.getFavoriteContent(this.content.id)
      .subscribe((response: any) => {
        if (response) {
          this.isFavorite = true;
        }
        else {
          this.isFavorite = false;
        }
      });
  }

  addToFavorite() {
    if (this.isAuthenticated) {
      this.isInvalidUser = false;
      this.service.addContentToFavorite(this.content)
        .subscribe((response: any) => {
          if (response) {
            if (response.success) {
              this.service.reloadUserInfo();
              this.isFavorite = true;
            }
          }
        });
    }
    else {
      this.isInvalidUser = true;
    }
  }

  removeFromFavorite() {
    if (this.isAuthenticated) {
      this.isInvalidUser = false;
      this.service.removeContentFromFavorite(this.content)
        .subscribe((response: any) => {
          if (response) {
            if (response.success) {
              this.service.reloadUserInfo();
              this.isFavorite = false;
            }
          }
        });
    }
    else {
      this.isInvalidUser = true;
    }
  }

}
