import { AWSUploadStatus } from './../../../models/awsUploadStatus';
import { AWSConfig } from './../../../aws/model/AWSConfig';
import { Customer } from './../../../models/customer';
import { CustomerService } from 'app/services/customer.service';
import { FormGroupUtils } from './../../../common/utils/form-group-utils';
import { PageTitleService } from './../../../core/page-title/page-title.service';
import { ResponseBase } from './../../../models/responseBase';
import { Content } from './../../../models/content';
import { MessageService } from 'primeng/components/common/messageservice';
import { ContentService } from './../../../services/content.service';
import { Router, ParamMap, UrlSegment } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import { concat } from 'rxjs/operators/concat'
import { Observable } from 'rxjs/Rx';
import { ActivatedRoute } from '@angular/router';
import { ArrayUtils } from 'app/common/utils/array-utils';

@Component({
  selector: 'ss-add-content',
  templateUrl: './add-content.component.html',
  styleUrls: ['./add-content.component.scss']
})
export class AddContentComponent implements OnInit {
  fg: FormGroup;
  bannerImage: File | null;
  bannerImageUrl: string;
  thumbnailImage: File | null;
  thumbnailImageUrl: string;
  video: File | null;
  trailer: File | null;

  content: Content;
  episodes: Content[];
  parentId: string;
  contentId: string;
  isEpisode: boolean;
  showCategories: boolean = false;
  selectedCategories: String[];
  selectedCategory: String[];
  selectedCelebrity: String[];
  selectedGenre: String[];
  selectedFeatured: String[];
  SelectedCategoryList: String[];
  orgOrder: string[];

  //for aws upload
  awsConfig: AWSConfig;
  startVideoUpload: boolean;
  awsOriginalKey: string;

  constructor(
    fb: FormBuilder,
    private messageService: MessageService,
    private service: ContentService,
    private activatedRoute: ActivatedRoute,
    private pageTitleService: PageTitleService,
    private router: Router) {
    this.fg = fb.group({
      title: fb.control('', [
        Validators.required]),
      description: fb.control('', []),
      is_premium: fb.control(false, []),
      has_episode: fb.control(false, []),
      categoryList: fb.control(''),
      is_youtubeVideoLink: fb.control(false, []),
      //is_youtubeTrailerLink: fb.control(false, []),
      youtube_VideoLink: fb.control('', []),
      youtube_TrailerLink: fb.control('', []),
    });
  }

  get has_episode() {
    return this.fg.get('has_episode').value;
  }

  get is_youtubeVideoLink() {
    return this.fg.get('is_youtubeVideoLink').value;
  }

  // get is_youtubeTrailerLink() {
  //   return this.fg.get('is_youtubeTrailerLink').value;
  // }

  onChange($event, categoryType) { /*Add content with multiple categories*/
    var selectedList = [];
    if (categoryType === 1) {
      this.selectedCategory = $event;
    }
    else if (categoryType === 2) {
      this.selectedCelebrity = $event;
    }
    else if (categoryType === 3) {
      this.selectedGenre = $event;
    }
    else if (categoryType === 4) {
      this.selectedFeatured = $event;
    }
    if (this.selectedCategory) {
      selectedList = selectedList.concat(this.selectedCategory);
    }
    if (this.selectedCelebrity) {
      selectedList = selectedList.concat(this.selectedCelebrity);
    }
    if (this.selectedGenre) {
      selectedList = selectedList.concat(this.selectedGenre);
    }
    if (this.selectedFeatured) {
      selectedList = selectedList.concat(this.selectedFeatured);
    }
    this.SelectedCategoryList = selectedList;
  }

  onSubmit() {
    this.selectedCategories = this.SelectedCategoryList; /*Add content with multiple categories*/
    this.fg.get('categoryList').setValue(this.selectedCategories);

    //validate video, trailer youtube links
    if (!this.is_youtubeVideoLink) {
      this.fg.get('youtube_VideoLink').setValue(null);
    }
    // if (!this.is_youtubeTrailerLink) {
    //   this.fg.get('youtube_TrailerLink').setValue(null);
    // }

    this.getContentObs()
      .map((value: Content) => value.id)
      .flatMap((contenntId: string) => {
        return this.getImageObservables(contenntId);
      })
      .finally(() => { this.naviagteBack() })
      .subscribe(
        (value: any) => {
          if (value.hasOwnProperty('success') && !value.success) {
            this.messageService.add({ severity: 'error', summary: 'File Uploaded failed', detail: '' });
          }
        });
  }

  private getContentObs(): Observable<any> {
    let contentObs: Observable<any>;
    if (!this.content && !this.isEpisode) {
      contentObs = this.service.addContent(this.fg.value);
    } else if (!this.content && this.isEpisode) {
      contentObs = this.service.addEpisode(this.contentId, this.fg.value);
    } else {
      contentObs = this.service.updateContent(FormGroupUtils.extractValue(this.fg, this.content));
    }
    return contentObs;
  }

  private getImageObservables(contenntId: string): Observable<any> {
    const input = [];
    if (this.bannerImage) {
      const formData: FormData = new FormData();
      formData.append('bannerImage', this.bannerImage);
      input.push(this.service.updateBanner(contenntId, formData));
    }
    if (this.thumbnailImage) {
      const formData: FormData = new FormData();
      formData.append('thumbnailImage', this.thumbnailImage);
      input.push(this.service.updateThumbnail(contenntId, formData));
    }
    if (this.video && !this.has_episode && !this.is_youtubeVideoLink) {
      //const formData: FormData = new FormData();
      //formData.append('thumbnailImage', this.video);
      // input.push(this.service.updateVideo(contenntId, formData));
      //input.push(this.service.updateVideo(contenntId, formData));
      this.uploadVideo(contenntId);
    }
    // if (this.trailer && !this.is_youtubeTrailerLink) {
    //   const formData: FormData = new FormData();
    //   formData.append('thumbnailImage', this.trailer);
    //   input.push(this.service.updateTailer(contenntId, formData));
    // }
    input.push(Observable.of(''));

    return Observable.concat(...input);
  }

  uploadVideo(contentId) {

    this.contentId = contentId;
    this.startVideoUpload = true;
  }

  private checkForEpisode() {
    this.activatedRoute.url
      .subscribe((response: UrlSegment[]) => {
        response.forEach((urlSegment: UrlSegment) => {
          if (urlSegment.path && urlSegment.path.indexOf('-episode') > 0) {
            this.isEpisode = true;
          }
        });
      });
  }

  private setHeader() {
    if (this.isEpisode) {
      this.pageTitleService.setTitle('Episode');
    } else {
      this.pageTitleService.setTitle('Content');
    }
  }

  ngOnInit() {
    this.checkForEpisode();
    this.setHeader();
    this.init()
  }

  private init() {
    this.activatedRoute.paramMap
      .map((value: ParamMap) => {
        return this.applyMapParam(value);
      })
      .flatMap((contentId: string) => {
        if (contentId && !this.isEpisode) {
          return Observable.forkJoin(
            this.service.getContentForAdmin(contentId),
            this.service.getAllEpisodesForAdmin(contentId)
          );
        } else if (contentId && this.isEpisode) {
          return Observable.forkJoin(
            this.service.getContentForAdmin(contentId));
        } else {
          return Observable.of(null);
        }
      })
      .subscribe((response: any[]) => {
        if (response) {
          this.content = response[0];
          FormGroupUtils.applyValue(this.fg, response[0]);
          if (!this.isEpisode) {
            this.episodes = response[1];
            this.orgOrder = this.episodes.map((content: Content) => content.id);
          }
          this.applyImageUrl();

          if (response[0].youtube_VideoLink != null) {
            this.fg.get("is_youtubeVideoLink").setValue(true);
          }
          // if (response[0].youtube_TrailerLink != null) {
          //   this.fg.get("is_youtubeTrailerLink").setValue(true);
          // }

          this.selectedCategories = response[0].categoryList;
        }
        this.showCategories = true;
      });
  }

  private applyMapParam(value: ParamMap) {
    this.contentId = value.get('contentId');
    this.parentId = value.get('contentId');
    if (this.isEpisode) {
      if (value.get('episodeId')) {
        this.contentId = value.get('episodeId');
      } else {
        this.contentId = this.parentId;
      }
      return value.get('episodeId');
    } else {
      return value.get('contentId');
    }
  }

  public naviagteBack() {
    // if (this.isEpisode) {
    //   this.router.navigate(['/admin/content/edit-content', this.parentId]);
    // } else {
    //   this.router.navigate(['/admin/content']);
    // }
  }

  private applyImageUrl() {
    if (this.content && this.content._links) {
      if (this.content._links.awsBannerUrl) {
        this.bannerImageUrl = this.content._links.awsBannerUrl.href;
      }
      if (this.content._links.awsThumbnailUrl) {
        this.thumbnailImageUrl = this.content._links.awsThumbnailUrl.href;
      }
    }
  }

  reorderEpisode() {
    this.service.reorderEpisode(this.contentId, ArrayUtils.reOrderInput(this.episodes, this.orgOrder))
      .subscribe((response: ResponseBase) => {
        if (response.success) {
          //this.messageService.add({ severity: 'success', summary: 'Re-Ordering Successful !', detail: response.message });
        } else {
          //this.messageService.add({ severity: 'error', summary: 'Re-Ordering Failed !', detail: response.message });
        }
      });
  }

}
