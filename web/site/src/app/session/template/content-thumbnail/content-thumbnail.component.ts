import { Router } from '@angular/router';
import { ContentService } from './../../../services/content.service';
import { Category } from 'app/models/Category';
import { CategoryService } from './../../../services/category.service';
import { AuthenticationService } from './../../../services/authentication.service';
import { Content } from './../../../models/content';
import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'ss-content-thumbnail',
  templateUrl: './content-thumbnail.component.html',
  styleUrls: ['./content-thumbnail.component.scss']
})
export class ContentThumbnailComponent implements OnInit {

  @Input() content: Content;
  price: number;
  private callCount: number;
  @Input() parentCatergory: string;
  @Input() asVerticalList: boolean;

  categoryIds: string[];
  categories: Category[];

  showYear: boolean = false;
  staticdata = 'This is a demo of using JW Player settings in VideoPro theme, for more details of this feature please check our document.';

  constructor(private authenticationService: AuthenticationService,
    private contentService: ContentService, private categoryService: CategoryService,
    private route: Router) { }

  ngOnInit() {
    this.price = 0;
    this.callCount = 0;

    if (this.content.payperviewCategoryId) {
      this.contentService.getPrice(this.content)
        .subscribe((price: number) => {
          this.price = price
        });
    }

    if (this.parentCatergory) {
      if (this.parentCatergory.toLowerCase() === "movies") {
        this.showYear = true;
      }
    }

    this.getContentCategories();
    // console.log('thumb nail call');
    // console.log(this.callCount);
  }

  play() {

    let redirectUrl: string;


    if (!this.authenticationService.getUser()) {
      redirectUrl = this.content._links.UIHref.href;
    } else if (this.content.is_premium && !this.authenticationService.isPremiumUser()) {
      redirectUrl = this.content._links.UIHref.href;
    } else if (this.price > 0) {
      redirectUrl = this.content._links.UIHref.href;
    } else {
      redirectUrl = '/session/content/play/' + this.content.id;
    }

    this.route.navigate([redirectUrl]);

    return false;
  }

  getPlayUrl() {
    this.callCount = this.callCount + 1;
    // if (!this.authenticationService.isUserAuthenticated()) {
    //   return this.content._links.UIHref.href;
    // } else if (this.content.is_premium && !this.authenticationService.isPremiumUser()) {
    //   return this.content._links.UIHref.href;
    // } else {
    //   return '/session/content/play/' + this.content.id;
    // }
    return this.content._links.UIHref.href;
  }

  getContentCategories() {
    this.categories = [];
    this.categoryIds = this.content.categoryList;
    if (this.categoryIds) {
      this.categoryService.getCategoriesByIds(this.categoryIds)
        .subscribe((outcome: Category[]) => {
          if (outcome) {
            this.categories = outcome.filter(outcome => outcome.category_type === 3);
          }
        });
    }
  }

}
