import { CategoryService, CategoryType } from 'app/services/category.service';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Category } from 'app/models/Category';

@Component({
  selector: 'ss-content-categories',
  templateUrl: './content-categories.component.html',
  styleUrls: ['./content-categories.component.scss']
})
export class ContentCategoriesComponent implements OnInit, OnChanges {

  categories: Category[];

  @Input() categoryIds: string[];

  constructor(private service: CategoryService) { }

  ngOnInit() {
    this.init();
  }

  //Do not display parent categories directly(i.e, CategoryType as 1) 
  //Get content categories(celebrity, genre, home featured and parent featured categories)
  init() {
    if (this.categoryIds) {
      this.service.getCategoriesByIds(this.categoryIds)
        .subscribe((outcome: Category[]) => {
          if (outcome) {
            this.categories = outcome.filter(outcome => outcome.category_type === CategoryType.Genre || outcome.category_type === CategoryType.Celebrity);
          }
        });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    this.categories = [];
    this.init();
  }

}
