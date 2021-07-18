import { Component, OnInit, Input, ElementRef, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Content } from 'app/models/content';
import { ContentService } from 'app/services/content.service';

import 'intersection-observer';

@Component({
  selector: 'ss-end-user-category-content',
  templateUrl: './category-content.component.html',
  styleUrls: ['./category-content.component.scss']
})
export class CategoryContentComponent implements OnInit, OnChanges, OnDestroy {

  @Input() categoryId: string;
  @Input() parentCatergory: string;
  @Input() asList: boolean;
  @Input() contentId: string;
  isLoaded = false;
  contentList: Content[];
  loading_imgs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

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

    owlOptionsPortrait = {
        stagePadding: 50,
        items: 8,
        dots: false,
        loop: false,
        lazyLoad: true,
        margin: 3,
        slideBy: 3,
        nav: true,
        navText: ['<span class=\'icon fa fa-angle-left\'></span>', '<span class=\'icon fa fa-angle-right\'></span>'],
        responsive: {
            0: {
                items: 2
            },
            300: {
                items: 3
            },
            600: {
                items: 4
            },
            800: {
                items: 5
            },
            1100: {
                items: 6
            },
            1300: {
                items: 7
            },
            1600: {
                items: 8
            }
        }
    };

  slideConfig = {
    speed: 300,
    slidesToShow: 5,
    slidesToScroll: 5,
    infinite: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1
        }
      }
    ]
  };

  constructor(private contentService: ContentService, private elementRef: ElementRef) {
    // console.log('INit log');
  }

  ngOnInit() {
    // this.init();
    this.contentList = [];
    this.isLoaded = false;

    if (this.asList) {
      this.init();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    // console.log('on change detected', changes);
    if (changes.categoryId) {
      if (changes.categoryId.previousValue != null && changes.categoryId.previousValue !== changes.categoryId.currentValue) {
        this.contentList = [];
        this.init();
      }
    }
    else {
      this.contentList = [];
      this.init();
    }
  }

  private init() {
    this.isLoaded = false;
    this.contentService.getAssignedContents(this.categoryId)
      .subscribe((outcome: Content[]) => {
        if (outcome) {
          if (this.contentId) {
            this.contentList = outcome.filter(outcome => outcome.id !== this.contentId);
          }
          else {
            this.contentList = outcome;
          }
        }
        this.isLoaded = true;
      });
  }

  initData(event) {
    if (event.value && !this.isLoaded) {
      this.init();
    }
  }

  // 1. Unsubscribe is only need for the subjects which runs endless like keyboard/mouse events
  //    HTTP subscriptions will call complete at the end so need for unsubscribe
  // 2. to use ngOnDestroy dont forget to implement OnDestroy interface
  ngOnDestroy() {
  }

}
