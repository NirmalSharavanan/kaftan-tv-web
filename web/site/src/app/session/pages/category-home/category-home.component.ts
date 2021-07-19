import { CategoryService } from './../../../services/category.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Category } from 'app/models/Category';
import { CategoryType } from './../../../services/category.service';
import { AuthenticationService } from './../../../services/authentication.service';
import { UserService } from './../../../services/user.service';
import { RealSessionStorageService } from 'app/common/service/real-session-storage.service';

@Component({
  selector: 'ss-category-home',
  templateUrl: './category-home.component.html',
  styleUrls: ['./category-home.component.scss']
})
export class CategoryHomeComponent implements OnInit, OnChanges {

  category_id: string;
  category: Category;
  channelsList: Category[];
  parentCategory: string;
  private sub: any;
  categories: Category[];
  channels: Category[];
  radios: Category[];
  isAuthenticated: boolean;
  loading = true;
  isSubscribed: boolean = false;
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

  constructor(private realSessionStorageService: RealSessionStorageService, private route: ActivatedRoute, private service: CategoryService, private authService: AuthenticationService,
              private userService: UserService) { }

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      this.channelsList = JSON.parse(this.realSessionStorageService.getSession("channels"))
        this.channelsList.map(item => {
          if(item[params['id']]) {
            this.category_id = item.id
          }
        })
      if (this.category_id === "radio") {
        this.getSubscriptionInfo();
        this.getRadios();
      }
      else if (this.category_id === "channels") {
        this.getChannels();
      }
      else {
        this.radios = null;
        this.channels = null;
        
        this.service.getCategory(this.category_id, true)
          .subscribe((response: Category) => {
            if (response != null) {
              this.category = response;
              this.parentCategory = response.name;
              if (response.showChannels) {
                this.getChannels();
              }
              if (response.showRadio) {
                this.getSubscriptionInfo();
                this.getRadios();
              }
              this.getFeaturedCategories();
              this.checkIsUserAuthenticated();
            }
          });
      }
    });
  }

  checkIsUserAuthenticated() {
    this.authService.isUserAuthenticated()
      .subscribe((isAuth: boolean) => {
        this.isAuthenticated = isAuth;
      });
  }

  //Do not display parent category contents directly(i.e, CategoryType as 1) 
  //Display featured categories for parent category
  getFeaturedCategories() {
    this.service.getFeaturedCategoriesForParentCategory(this.category_id)
      .subscribe((outcome: Category[]) => {
        this.loading = false;
        if (outcome) {
          this.categories = outcome;
        }
      });
  }

  getChannels() {
    this.loading = true;
    this.service.getAllCategories(CategoryType.Channel, true)
      .subscribe((outcome: Category[]) => {
        if (outcome) {
          let response = outcome.filter(outcome => outcome.showActive === true);
          this.channels = response;
        }
        this.loading = false;
      });
  }

  getSubscriptionInfo() {
    this.userService.getPremiumUser()
      .subscribe((userSubscription: any) => {
        if(userSubscription && userSubscription.length > 0) {
          if(userSubscription[0].subscriptionInfo.features.includes("Audio On Demand")) {
            this.isSubscribed = true;
          } else {
            this.isSubscribed = false;
          }
        }
      });
  }

  getRadios() {
    this.loading = true;
    if(this.isSubscribed) {
      this.service.getAllCategories(CategoryType.Radio, true)
      .subscribe((outcome: Category[]) => {
        if (outcome) {
          let response = outcome.filter(outcome => outcome.showActive === true);
          this.radios = response;
        }
        this.loading = false;
      });
    } 
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.categoryId) {
      if (changes.categoryId.previousValue != null && changes.categoryId.previousValue !== changes.categoryId.currentValue) {
        this.getFeaturedCategories()
      }
      else {
        this.getFeaturedCategories();
      }
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
