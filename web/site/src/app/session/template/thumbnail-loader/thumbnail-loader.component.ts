import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ss-thumbnail-loader',
  templateUrl: './thumbnail-loader.component.html',
  styleUrls: ['./thumbnail-loader.component.scss']
})
export class ThumbnailLoaderComponent implements OnInit {

  loading_imgs = [1, 2, 3, 4, 5, 6];

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

  constructor() { }

  ngOnInit() {
  }

}
