import { CategoryType } from './../../../services/category.service';
import { CategoryService } from 'app/services/category.service';
import { Category } from './../../../models/Category';
import { StaticPage } from 'app/models/StaticPage';
import { StaticPagesService } from 'app/services/static-pages.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ss-category-in-header',
  templateUrl: './category-in-header.component.html',
  styleUrls: ['./category-in-header.component.scss']
})
export class CategoryInHeaderComponent implements OnInit {

  categories: Category[];
  staticPages: StaticPage[];
  blogId: string;

  constructor(private service: CategoryService, private staticPageService: StaticPagesService) { }

  ngOnInit() {
    this.init();
  }

  private init() {
    this.service.getAllCategories(CategoryType.Category, true)
      .subscribe((outcome: Category[]) => {
        if (outcome) {
          this.categories = outcome.filter(n => n.show_in_menu);
        }
      });

    //load static menus
    this.staticPageService.getStaticPagesForUser().subscribe((staticPages: StaticPage[]) => {
      if (staticPages) {
        this.staticPages = staticPages.filter(staticPages => staticPages.display_at === "Header");
      }
    })
  }

}
