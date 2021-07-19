import { Component, OnInit, Input , ViewChild, ElementRef} from '@angular/core';
import { Category } from 'app/models/Category';
import { Content } from 'app/models/content';
import { CategoryService } from 'app/services/category.service';
import { CategoryType } from './../../../services/category.service';
import { ContentService } from 'app/services/content.service';
import { NgxSpinnerService } from "ngx-spinner";
import { RealSessionStorageService } from 'app/common/service/real-session-storage.service';

@Component({
  selector: 'ss-home-featured',
  templateUrl: './home-featured.component.html',
  styleUrls: ['./home-featured.component.scss']
})
export class HomeFeaturedComponent implements OnInit {

  @Input() category: Category;

  @ViewChild('playvideo') play: ElementRef;

  featuredCategories: Category[];
  assignedcontentList: Content[];
  contentList: Content[];
  selectedFeatured: Category;
  channels: Category[];
  totalchannelList: Category[];
  radios: Category[];
  totalradioList: Category[];
  isLoaded = false;
  loading_imgs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  VideoUrl : string;
  showId : string = '';

  constructor(private realSessionStorageService: RealSessionStorageService, private service: CategoryService, private contentService: ContentService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.getFeaturedCategories();
    if (this.category.showChannels) {
      this.getChannels();
    }
    if (this.category.showRadio) {
      this.getRadios();
    }
  }

  playvideo(id){
    this.showId = id;
    console.log('content id ', this.showId);
    this.contentService.getContentToWatch(id, true).subscribe((res:any) => {
      console.log('the response from the video is ', res);
      this.VideoUrl = res.videoPlayInfoList[0].sdVideoUrl;
      console.log('video url is ', this.VideoUrl);
    },error => {
      alert('please login');
    })
    // this.service.getContentToWatch(this.content.id, true)
    // .subscribe((response: VideoPlayWrapper) => {
  }

  videomoved(){
    console.log('mouse out worked');
    this.showId = '';
  }

  //Get Home Featured
  getFeaturedCategories() {
    this.spinner.show();
    this.service.getAllCategories(CategoryType.Featured, true)
      .subscribe((outcome: Category[]) => {
        this.spinner.hide();
        if (outcome) {
          this.featuredCategories = outcome.filter(outcome => outcome.home_category_id === this.category.id && outcome.showInHome === true);
          if (this.featuredCategories && this.featuredCategories.length > 0) {
            this.selectedFeatured = this.featuredCategories[0];
          }
        }
      });
  }

  private getContents() {
    this.isLoaded = false;
    this.assignedcontentList = [];
    this.contentList = [];
    this.spinner.show();
    this.contentService.getAssignedContents(this.selectedFeatured.id)
      .subscribe((outcome: Content[]) => {
        this.spinner.hide();
        if (outcome) {
          this.assignedcontentList = outcome;
          this.contentList = outcome.slice(0, 15).map(item => {
            item._links.UIHref.href= item._links.UIHref.href.replace(item.id, item.title.replace(/ /g, "_"))
            return item
          })
          let contentList = JSON.parse(this.realSessionStorageService.getSession("contentList"));
          if(contentList) {
            let tempContentList =  [...contentList];
            this.contentList.map(item => {
              if(!contentList.some(el => el.id === item.id)) {
                tempContentList.push(item)
              }
            })
            contentList = [...tempContentList];
          }
          else {
            contentList = this.contentList;
          }
        
          
          this.realSessionStorageService.setSession("contentList", JSON.stringify(contentList));
          console.log('the values of contents ', this.contentList);
        }
        this.isLoaded = true;
      });
  }

  navigateTab(featuredId) {
    this.service.getCategory(featuredId, true)
      .subscribe((outcome: Category) => {
        if (outcome) {
          this.selectedFeatured = outcome;
          this.getContents();
        }
      });
  }

  getChannels() {
    this.isLoaded = false;
    this.service.getAllCategories(CategoryType.Channel, true)
      .subscribe((outcome: Category[]) => {
        if (outcome) {
          let response = outcome.filter(outcome => outcome.showActive === true);
          this.totalchannelList = response;
          this.channels = response.slice(0, 15).map(item => {
            let data = item.name.split(" ");
            item._links.UIHref.href= item._links.UIHref.href.replace(item.id, data[data.length-1])
            item[data[data.length-1]] = item.name
            return item
          })
          let channels = JSON.parse(this.realSessionStorageService.getSession("channels"));
          if(channels) {
            let tempChannels =  [...channels];
            this.contentList.map(item => {
              if(!channels.some(el => el.id === item.id)) {
                tempChannels.push(item)
              }
            })
            channels = [...tempChannels];
          }
          else {
            channels = this.channels;
          }
          this.realSessionStorageService.setSession("channels", JSON.stringify(channels));
        }
        this.isLoaded = true;
      });
  }

  getRadios() {
    this.isLoaded = false;
    this.service.getAllCategories(CategoryType.Radio, true)
      .subscribe((outcome: Category[]) => {
        if (outcome) {
          let response = outcome.filter(outcome => outcome.showActive === true);
          this.totalradioList = response;
          this.radios = outcome.slice(0, 15);
        }
        this.isLoaded = true;
      });
  }

  initData(event) {
    if (event.value && !this.isLoaded) {
      if (this.featuredCategories && this.featuredCategories.length > 0) {
        this.getContents();
      }
      if (this.channels && this.channels.length > 0) {
        this.getChannels();
      }
      if (this.radios && this.radios.length > 0) {
        this.getRadios();
      }
    }
  }

}
