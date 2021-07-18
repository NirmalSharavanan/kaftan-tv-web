import { CategoryType } from './../../../services/category.service';
import { Component, OnInit } from '@angular/core';
import { Category } from 'app/models/Category';
import { CategoryService } from 'app/services/category.service';
import { ContentWatchHistory } from 'app/models/contentWatchHistory';
import { ContentService } from 'app/services/content.service';
import { AuthenticationService } from './../../../services/authentication.service';

@Component({
  selector: 'ss-end-user-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  loading = true;
  categories: Category[];
  sub: any;
  watchHistoryList: ContentWatchHistory[];
  homecategories: Category[];

  owlOptions = {
    stagePadding: 50,
    items: 5,
    dots: false,
    loop: false,
    lazyLoad: true,
    margin: 3,
    slideBy: 3,
    nav: true,
    navText: ['<span class=\'icon fa fa-angle-left\'></span>', '<span class=\'icon fa fa-angle-right\'></span>'],
    responsive: {
      0: {
        items: 1
      },
      300: {
        items: 2
      },
      600: {
        items: 2
      },
      800: {
        items: 3
      },
      1100: {
        items: 4
      },
      1300: {
        items: 5
      },
      1600: {
        items: 6
      }
    }
  };

  constructor(private service: CategoryService,
    private authenticationService: AuthenticationService,
    private contentService: ContentService) { }

  ngOnInit() {
    this.watchHistoryList = [];
    this.init();
  }

  //Get only home featured categories
  private init() {
    // this.sub = this.service.getAllCategories(CategoryType.Featured, true)
    //   .subscribe((outcome: Category[]) => {
    //     this.loading = false;
    //     if (this.authenticationService.getUser()) {
    //       this.contentService.getContentToWatchHistory()
    //         .subscribe((response: ContentWatchHistory[]) => {
    //           if (response) {
    //             this.watchHistoryList = response;
    //           }
    //         });
    //     }
    //     if (outcome) {
    //       // this.categories = outcome.filter(outcome => outcome.parent_category_id === null);
    //       this.categories = outcome.filter(outcome => outcome.showInHome === true);
    //     }
    //   });
    this.getCategories();

  }

  getCategories() {
    this.sub = this.service.getAllCategories(CategoryType.HomeCategory, true)
      .subscribe((outcome: Category[]) => {
        if (outcome) {
          this.homecategories = outcome.filter(outcome => outcome.showInHome === true);
        }
        if (this.authenticationService.getUser()) {
          this.contentService.getContentToWatchHistory()
            .subscribe((response: ContentWatchHistory[]) => {
              if (response) {
                this.watchHistoryList = response;
              }
            });
        }
        this.loading = false;
      });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

}
