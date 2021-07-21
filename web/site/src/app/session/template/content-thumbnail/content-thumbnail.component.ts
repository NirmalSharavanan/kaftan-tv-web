import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from './../../../services/content.service';
import { Category } from 'app/models/Category';
import { CategoryService } from './../../../services/category.service';
import { AuthenticationService } from './../../../services/authentication.service';
import { Content } from './../../../models/content';
import { Component, OnInit, Input } from '@angular/core';
import { NavigateWithUrl } from 'app/services/navigate-with-url.service';


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

  constructor(
    private navigateWithUrl: NavigateWithUrl,
    private authenticationService: AuthenticationService,
    private contentService: ContentService, private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.price = 0;
    this.callCount = 0;
    this.content._links.UIHref.href = this.content._links.UIHref.href.replace(this.content.id, this.content.title.replace(/ /g, "_"));

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
  navigateToCategories(data: Content) {
    console.log(data);
    let redirecturl = data._links.UIHref.href.replace(data.id, data.title);
    this.navigateWithUrl.setNavigateData({url: data.title.replace(/ /g, "_"), name: data.title, id: data.id })
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([redirecturl]);
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

    this.router.navigate([redirectUrl]);

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
            this.categories = outcome.filter(outcome => outcome.category_type === 3)
          }
        });
    }
  }

}
