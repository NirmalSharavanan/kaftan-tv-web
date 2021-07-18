import { AuthenticationService } from './../../../services/authentication.service';
import { AWSInfo } from './../../../models/awsInfo';
import { ContentService } from 'app/services/content.service';
import { Content } from 'app/models/content';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PlayContent } from 'app/models/playContent';
import { CategoryService, CategoryType } from 'app/services/category.service';
import { Category } from 'app/models/Category';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'ss-content-template',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit, OnChanges {

  @Input() content: Content;
  playTrailer: boolean;
  childContents: Content[];
  sub: any;
  categoryIds: string[];
  categories: Category[];
  showPlayer: boolean = false;
  private url: SafeResourceUrl;
  pageType: string = "album";

  constructor(private service: ContentService, private categoryService: CategoryService, private authService: AuthenticationService,
    private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.showPlayer = false;
    this.getTrailerUrl();

    if (this.content.has_episode) {
      this.getEpisodesOrChildrens();
    }
    this.getContentCategories();
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log('on change detected');
    // console.log(changes);
    this.showPlayer = false;
    if (changes.content.previousValue != null && changes.content.previousValue.id !== changes.content.currentValue.id) {
      this.childContents = [];
      this.getTrailerUrl();
      this.getEpisodesOrChildrens();
      this.getContentCategories();
    }
  }

  getTrailerUrl() {
    if (this.content.youtube_TrailerLink) {
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.content.youtube_TrailerLink);
    }
  }

  getEpisodesOrChildrens() {
    this.sub = this.service.getAllEpisodes(this.content.id)
      .subscribe((response: Content[]) => {
        if (response) {
          this.childContents = response;
        }
      });
  }

  //Do not display parent categories directly(i.e, CategoryType as 1) 
  //Get content categories(celebrity, genre, home featured and parent featured categories)
  getContentCategories() {
    this.categories = [];
    this.categoryIds = this.content.categoryList;
    if (this.categoryIds) {
      this.sub = this.categoryService.getCategoriesByIds(this.categoryIds)
        .subscribe((outcome: Category[]) => {
          if (outcome) {
            this.categories = outcome.filter(outcome => outcome.category_type != CategoryType.Category);
          }
        });
    }
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  playTrailers() {
    this.playTrailer = true;
  }

  cancelPlayTrailers() {
    this.playTrailer = false;
  }

  togglePlayer($event) {
    this.showPlayer = $event;
  }

}
