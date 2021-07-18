import { CelebrityType } from './../../../models/CelebrityType';
import { CategoryType } from './../../../services/category.service';
import { FileUpload } from 'primeng/primeng';
import { ContentService } from './../../../services/content.service';
import { ContentOrder } from './../../../models/content-order';
import { ArrayUtils } from './../../../common/utils/array-utils';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/components/common/messageservice';
import { Category } from './../../../models/Category';
import { Component, OnInit } from '@angular/core';
import { ParamMap, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { CategoryService } from 'app/services/category.service';

enum ContentMode {
  CONTENT = 1,
  MAP_CONTENT = 2,
  SORT_CONTENT = 3
}

@Component({
  selector: 'ss-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent implements OnInit {

  fg: FormGroup;
  categoryId: string;
  mode: ContentMode = ContentMode.CONTENT;
  categoryType: CategoryType;
  bannerImage: File | null;
  bannerImageUrl: string;
  thumbnailImage: File | null;
  thumbnailImageUrl: string;
  showCelebrityTypes: boolean = false;
  selectedCelbebrites: String[];
  categories: Category[];
  contentType: string;
  categoryTypeName: string;
  homeCategories: Category[];

  constructor(
    fb: FormBuilder,
    private service: CategoryService,
    private messageService: MessageService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
    this.fg = fb.group({
      categoryName: fb.control('', []),
      price: fb.control('', [Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]),
      premium_price: fb.control('', [Validators.pattern(/^[0-9]+(\.[0-9]{1,2})?$/)]),
      parent_category_id: fb.control(''),
      showInMenu: fb.control(false),
      liveUrl: fb.control(''),
      showChannels: fb.control(false),
      showRadio: fb.control(false),
      showInMusic: fb.control(false),
      showMyPlayList: fb.control(false),
      showInHome: fb.control(false),
      showActive: fb.control(true),
      showImageOnly: fb.control(false),
      link: fb.control(''),
      home_category_id: fb.control('')
    });
  }

  get showImageOnly() {
    return this.fg.get('showImageOnly').value;
  }

  onSubmit() {
    const formData: FormData = new FormData();
    formData.append('name', this.fg.get('categoryName').value);
    formData.append('showInMenu', this.fg.get('showInMenu').value);
    formData.append('bannerImage', this.bannerImage);
    formData.append('showChannels', this.fg.get('showChannels').value);
    formData.append('showRadio', this.fg.get('showRadio').value);

    if (this.categoryType === CategoryType.Category) {
      formData.append('showInMusic', this.fg.get('showInMusic').value);
      formData.append('showMyPlayList', this.fg.get('showMyPlayList').value);
    }

    if (this.categoryType === CategoryType.Featured) {
      if (this.fg.get('parent_category_id').value != "") {
        formData.append('parent_category_id', this.fg.get('parent_category_id').value);
      }
      if (this.fg.get('home_category_id').value != "") {
        formData.append('home_category_id', this.fg.get('home_category_id').value);
      }
    }

    if (this.categoryType === CategoryType.PayPerView) {
      formData.append('price', this.fg.get('price').value);
      if (this.fg.get('premium_price').value) {
        formData.append('premium_price', this.fg.get('premium_price').value);
      }
      else {
        formData.append('premium_price', '0');
      }
    }

    if (this.categoryType === CategoryType.Channel || this.categoryType === CategoryType.Radio) {
      formData.append('thumbnailImage', this.thumbnailImage);
      formData.append('liveUrl', this.fg.get('liveUrl').value);
      formData.append('showActive', this.fg.get('showActive').value);
    }

    if (this.categoryType === CategoryType.HomeCategory) {
      formData.append('showImageOnly', this.fg.get('showImageOnly').value);
      formData.append('link', this.fg.get('link').value);
    }
    if (this.categoryType === CategoryType.Featured || this.categoryType === CategoryType.HomeCategory) {
      formData.append('showInHome', this.fg.get('showInHome').value);
    }

    if (this.selectedCelbebrites) {
      formData.append('celebrityTypeId', this.selectedCelbebrites.toString());
    }

    let categoryObs: Observable<any>;
    if (this.categoryId) {
      categoryObs = this.service.updateCategory(formData, this.categoryId, this.categoryType)
      categoryObs.subscribe(
        value => {
          this.router.navigate(['/admin/meta-data', this.categoryName]);
        });
    }
    else {
      if (this.categoryType === CategoryType.Featured || this.categoryType === CategoryType.PayPerView) {
        this.addCategory(formData);
      }
      else {
        if (this.categoryType === CategoryType.Channel || this.categoryType === CategoryType.Radio) {
          if (this.bannerImage && this.thumbnailImage) {
            this.addCategory(formData);
          } else {
            this.messageService.add({ severity: 'error', summary: 'Please upload banner & thumbnail image', detail: '' });
          }
        }
        else {
          if (this.bannerImage) {
            this.addCategory(formData);
          } else {
            this.messageService.add({ severity: 'error', summary: 'Please upload banner image', detail: '' });
          }
        }
      }
    }
  }

  private addCategory(formData) {
    let categoryObs: Observable<any>;
    categoryObs = this.service.addCategory(formData, this.categoryType)
    categoryObs.subscribe(
      value => {
        if (value != null) {
          if (value.success) {
            this.router.navigate(['/admin/meta-data', this.categoryName]);
          }
          else {
            this.messageService.add({ severity: 'error', summary: value.message, detail: '' });
          }
        }
      });
  }

  get categoryName() {
    return CategoryType[this.categoryType];
  }

  onChange($event) {
    this.selectedCelbebrites = $event;
  }

  ngOnInit() {
    this.init()
  }

  init() {
    this.activatedRoute.paramMap
      .map((paramMap: ParamMap) => {
        this.categoryType = CategoryType[paramMap.get('categoryType')];
        if (this.categoryType === CategoryType.HomeCategory) {
          this.categoryTypeName = "Home Category";
        }
        else {
          this.categoryTypeName = this.categoryName;
        }
        return paramMap.get('categoryId');
      })
      .flatMap((categoryId: string) => {
        if (categoryId) {
          return this.service.getCategory(categoryId, false);
        } else {
          return Observable.of(null);
        }
      })
      .subscribe((response: Category) => {

        this.getCategories();
        this.assignData(response);
        if (this.categoryType === CategoryType.Celebrity) {
          this.showCelebrityTypes = true;
        }
      });

  }

  private assignData(response: Category) {
    if (response) {
      this.fg.get('categoryName').setValue(response.name);
      this.fg.get('showInMenu').setValue(response.show_in_menu);
      this.fg.get('price').setValue(response.price);
      this.fg.get('premium_price').setValue(response.premium_price);
      this.fg.get('parent_category_id').setValue(response.parent_category_id ? response.parent_category_id : "");
      if (response.parent_category_id) {
        this.fg.get('parent_category_id').disable();
      }
      this.fg.get('home_category_id').setValue(response.home_category_id ? response.home_category_id : "");
      if (response.home_category_id) {
        this.fg.get('home_category_id').disable();
      }
      if (this.categoryType === CategoryType.Channel || this.categoryType === CategoryType.Radio) {
        this.fg.get('liveUrl').setValue(response.liveUrl.live480Url);
        this.fg.get('showActive').setValue(response.showActive);
      }
      this.fg.get('showChannels').setValue(response.showChannels);
      this.fg.get('showRadio').setValue(response.showRadio);
      this.fg.get('showInMusic').setValue(response.showInMusic);
      this.fg.get('showMyPlayList').setValue(response.showMyPlayList);
      this.fg.get('showInHome').setValue(response.showInHome);
      this.fg.get('showImageOnly').setValue(response.showImageOnly);
      this.fg.get('link').setValue(response.link);

      if (response._links) {
        if (response._links.awsBannerUrl) {
          this.bannerImageUrl = response._links.awsBannerUrl.href;
        }
        if (response._links.awsThumbnailUrl) {
          this.thumbnailImageUrl = response._links.awsThumbnailUrl.href;
        }
      }
      this.categoryId = response.id;
      this.selectedCelbebrites = response.celebrityTypeList;

      this.checkContentType(response);

    }
  }

  // Map content
  private checkContentType(response: Category) {
    if (this.categoryType === CategoryType.Featured) {
      if (!response.home_category_id && response.parent_category_id) {
        this.service.getCategory(response.parent_category_id, false)
          .subscribe((parentcat_response: Category) => {
            if (parentcat_response) {
              if (parentcat_response.category_type === CategoryType.Radio || parentcat_response.showRadio == true || parentcat_response.showMyPlayList == true) {
                this.contentType = 'audio';
              }
              else {
                this.contentType = 'video';
              }
            }
          });
      }
      else {
        this.contentType = 'all';
      }
    }
    else {
      if (!response.showRadio && !response.showMyPlayList) {
        this.contentType = 'video';
      }
      else {
        this.contentType = 'audio';
      }
    }
  }

  //Get parent categories(Category Type as 1, 6 and 7) for display categories dropdown in featured categories add/edit
  private getCategories() {
    return Observable.forkJoin(
      this.service.getAllCategories(CategoryType.Category, false),
      this.service.getAllCategories(CategoryType.Channel, false),
      this.service.getAllCategories(CategoryType.Radio, false),
      this.service.getAllCategories(CategoryType.HomeCategory, false)
    )
      .subscribe((response: any[]) => {
        if (response) {
          this.categories = response[0];
          if (response[1].length > 0) {
            this.categories = this.categories.concat(response[1]);
          }
          if (response[2].length > 0) {
            this.categories = this.categories.concat(response[2]);
          }
          this.homeCategories = response[3].filter(response => response.showImageOnly === false);
        }
      });
  }

}
