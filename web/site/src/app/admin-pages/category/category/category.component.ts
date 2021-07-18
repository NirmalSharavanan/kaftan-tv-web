import { CategoryType } from './../../../services/category.service';
import { ResponseBase } from './../../../models/responseBase';
import { ArrayUtils } from './../../../common/utils/array-utils';
import { Category } from './../../../models/Category';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RestAPI } from '../../../helper/api.constants';
import { HttpService } from '../../../helper/httpService';
import { Message } from 'primeng/primeng';
import { ReOrder } from 'app/models/re-order';
import { MessageService } from 'primeng/components/common/messageservice';
import { CategoryService } from 'app/services/category.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css'],
})

export class CategoryComponent implements OnInit {

  categories: Category[];
  categoriesOrg: string[];
  isSaveEnabled: boolean;
  categoryType: CategoryType;
  categoryId: string;
  displaydialog: boolean = false;

  constructor(
    private service: CategoryService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.init();
  }

  onReorder() {
    this.service.reorder(ArrayUtils.reOrderInput(this.categories, this.categoriesOrg), this.categoryType)
      .subscribe((response: ResponseBase) => {
        if (response.success) {
          this.messageService.add({ severity: 'success', summary: 'Re-Ordering Successful !', detail: response.message });
          this.init();
          this.isSaveEnabled = false;
        } else {
          this.messageService.add({ severity: 'error', summary: 'Re-Ordering Failed !', detail: response.message });
        }
      });
  }

  enableSave() {
    this.isSaveEnabled = true;
  }

  get categoryName() {
    return CategoryType[this.categoryType];
  }

  private init() {
    this.activatedRoute.paramMap
      .map((paramMap: ParamMap) => {
        return CategoryType[paramMap.get('categoryType')];
      })
      .flatMap((categoryType: CategoryType) => {
        this.categoryType = categoryType;
        return this.service.getAllCategories(categoryType, false);
      })
      .subscribe((outcome: Category[]) => {
        if (outcome) {
          this.categories = outcome;
          this.categoriesOrg = this.categories.map((category: Category) => {
            return category.id;
          });
        }
      });
  }

  showDialog(id: string) {
    this.categoryId = id;
    this.displaydialog = true;
  }

  deleteCategory(categoryId) {
    this.displaydialog = false;
    this.service.deleteCategory(categoryId)
      .subscribe((response: any) => {
        if (response) {
          if (response.success) {
            this.init();
            this.messageService.add({ severity: 'info', summary: response.message, detail: '' });
          }
        }
      });
  }
}
