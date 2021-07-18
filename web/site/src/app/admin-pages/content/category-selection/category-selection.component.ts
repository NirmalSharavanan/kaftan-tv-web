import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { CategoryService } from 'app/services/category.service';
import { Category } from './../../../models/Category';
import { CategoryType } from './../../../services/category.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'ss-category-selection',
  templateUrl: './category-selection.component.html',
  styleUrls: ['./category-selection.component.scss']
})
export class CategorySelectionComponent implements OnInit {

  fg: FormGroup;
  @Input() selectedCategories: string[];
  @Input() categoryType: number;
  @Output() onChange: EventEmitter<string[]> = new EventEmitter();
  categories: Category[];
  @Input() contentType: string;


  allcategories: Category[];
  parentCategory: Category;
  audioCategories: Category[] = [];
  videoCategories: Category[] = [];
  featuredCategories: Category[];

  constructor(private fb: FormBuilder, private service: CategoryService) {
    this.fg = fb.group({});
  }

  ngOnChanges(changes: SimpleChanges) {
    this.init();
  }

  onValueChange() {
    this.onChange.emit(this.getFormatedoutput());
  }

  get selectedCategoriesAry() {
    return this.fg.get('selectedCategoriesAry' + this.categoryType);
  }

  get categoryTypeName() {
    return CategoryType[this.categoryType];
  }

  ngOnInit() {
    this.init();
  }

  private init() {
    this.fg.addControl("selectedCategoriesAry" + this.categoryType, this.fb.control(''));

    this.service.getAllCategories(this.categoryType, false)
      .subscribe((outcome: Category[]) => {
        if (outcome) {
          if (this.categoryType === CategoryType.Featured) {

            this.service.getAllCategoriesForAdmin()
              .subscribe((response: Category[]) => {
                if (response.length > 0) {
                  this.allcategories = response;

                  this.audioCategories = [];
                  this.videoCategories = [];

                  const homeFeatured = outcome.filter(outcome => outcome.parent_category_id === null);
                  const otherFeatured = outcome.filter(outcome => outcome.parent_category_id != null);

                  if (otherFeatured && otherFeatured.length > 0) {
                    otherFeatured.forEach((item) => {
                      const parentCategory = this.allcategories.filter(outcome => outcome.id === item.parent_category_id);
                      this.parentCategory = parentCategory.length > 0 ? parentCategory[0] : null;
                      if (this.parentCategory != null) {
                        if (this.parentCategory.category_type != CategoryType.Radio && this.parentCategory.showRadio == false && this.parentCategory.showMyPlayList == false) {
                          this.videoCategories.push(item);
                        }
                        else {
                          this.audioCategories.push(item);
                        }
                      }
                    });
                  }

                  this.featuredCategories = homeFeatured;
                  if (this.contentType === 'audio') {
                    this.featuredCategories = this.audioCategories.length > 0 ? this.featuredCategories.concat(this.audioCategories) : this.featuredCategories;
                  }
                  else {
                    this.featuredCategories = this.videoCategories.length > 0 ? this.featuredCategories.concat(this.videoCategories) : this.featuredCategories;
                  }

                  this.categories = this.featuredCategories;
                  this.applySelection(this.categoryType);
                }
              });
          }
          else {
            if (this.contentType === 'audio') {
              this.categories = outcome.filter(outcome => outcome.showRadio == true || outcome.showMyPlayList == true);
            }
            else {
              this.categories = outcome.filter(outcome => outcome.showRadio == false && outcome.showMyPlayList == false);
            }
            // this.categories = outcome;
            this.applySelection(this.categoryType);
          }
        }
        else {
          this.categories = [];
        }
      });
  }

  private applySelection(categoryType) {
    const selectedObjectes: Category[] = [];
    if (this.selectedCategories) {
      this.categories.forEach((item) => {
        if (this.selectedCategories.indexOf(item.id) >= 0) {
          selectedObjectes.push(item);
        }
      });
    }
    this.selectedCategoriesAry.setValue(selectedObjectes);
    this.onChange.emit(this.getFormatedoutput());
  }

  private getFormatedoutput(): string[] {
    return (this.selectedCategoriesAry.value as Category[])
      .map((value: Category) => value.id)
  }
}
