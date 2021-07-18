
import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { FormGroupUtils } from './../../../common/utils/form-group-utils';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Rx';
import { Router, ParamMap, UrlSegment, ActivatedRoute } from '@angular/router';
import { ResponseBase } from './../../../models/responseBase';
import { MessageService } from 'primeng/components/common/messageservice';
import { Content } from './../../../models/content';
import { ContentService } from './../../../services/content.service';

@Component({
  selector: 'ss-add-edit-content',
  templateUrl: './add-edit-content.component.html',
  styleUrls: ['./add-edit-content.component.scss']
})

export class AddEditContentComponent implements OnInit, OnChanges {
  fg: FormGroup;
  bannerImage: File | null;
  bannerImageUrl: string;
  thumbnailImage: File | null;
  thumbnailImageUrl: string;
  trailer: File | null;

  @Input() content: Content;
  @Input() isEpisode: boolean;
  @Input() episode: Content;
  parentId: string;

  contentId: string;
  selectedCategories: String[];
  selectedCategory: String[];
  selectedCelebrity: String[];
  selectedGenre: String[];
  selectedFeatured: String[];
  SelectedCategoryList: String[];
  contentType: string;

  message: string;
  visible: boolean;
  @Output()
  updateComplete: EventEmitter<any> = new EventEmitter<any>();

  // content description
  maxLength = 180;

  constructor(
    fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private service: ContentService) {
    this.fg = fb.group({
      title: fb.control('', [Validators.required]),
      description: fb.control('', [Validators.required]),
      content_type: fb.control('', []),
      is_premium: fb.control(false, []),
      has_episode: fb.control(false, []),
      categoryList: fb.control(''),
      is_youtubeVideoLink: fb.control(false, []),
      youtube_VideoLink: fb.control('', []),
      youtube_TrailerLink: fb.control('', []),
      active_date: fb.control('', [Validators.required]),
      year: fb.control(''),
    });
  }

  get description() {
    return this.fg.get('description').value;
  }

  get has_episode() {
    if (this.fg.get('has_episode').value === true) {
      this.fg.get('is_youtubeVideoLink').setValue(false);
      this.fg.get('youtube_VideoLink').clearValidators();
      this.fg.get('youtube_VideoLink').updateValueAndValidity();
    }
    return this.fg.get('has_episode').value;
  }

  get is_youtubeVideoLink() {
    if (this.fg.get('is_youtubeVideoLink').value === false) {
      this.fg.get('youtube_VideoLink').clearValidators();
      this.fg.get('youtube_VideoLink').updateValueAndValidity();
    }
    return this.fg.get('is_youtubeVideoLink').value;
  }

  /*Add content with multiple categories*/
  onChange($event, categoryType) {
    let selectedList = [];
    if (categoryType === 1) {
      this.selectedCategory = $event;
    } else if (categoryType === 2) {
      this.selectedCelebrity = $event;
    } else if (categoryType === 3) {
      this.selectedGenre = $event;
    } else if (categoryType === 4) {
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

  ngOnChanges(changes: SimpleChanges) {
    this.init();
  }

  ngOnInit() {
    this.init()
  }

  private init() {
    if (!this.contentType) {
      this.contentType = this.activatedRoute.snapshot.paramMap.get('type');
      this.fg.get('content_type').setValue(this.contentType);
    }
    if (this.content) {
      if (this.isEpisode) {
        this.parentId = this.content.id;
        if (this.episode) {
          this.applyResponse(this.episode);
        }
      } else {
        this.applyResponse(this.content);
      }
    }
  }

  private applyResponse(response: Content) {
    this.content = response;
    this.contentId = response.id;
    this.content.active_date = response.active_date ? new Date(response.active_date) : null;
    FormGroupUtils.applyValue(this.fg, this.content);

    this.applyImageUrl();

    if (response.youtube_VideoLink != null) {
      this.fg.get('is_youtubeVideoLink').setValue(true);
    }
    if (response.categoryList) {
      this.selectedCategories = response.categoryList;
    }
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

  onSubmit() {
    if (this.content) {
      if (this.isEpisode && !this.episode) {
        // if (!this.thumbnailImage || !this.bannerImage) {
        //   this.messageService.add({ severity: 'error', summary: 'Please upload thumbnail & banner images', detail: '' });
        // } else {
        //   this.addEditContent();
        // }
        this.addEditContent();
      }
      else {
        this.addEditContent();
      }
    } else {
      if (this.contentType === 'audio') {
        this.fg.get('has_episode').setValue(true);
      }
      if (!this.thumbnailImage || !this.bannerImage) {
        this.messageService.add({ severity: 'error', summary: 'Please upload thumbnail & banner images', detail: '' });
      } else {
        this.addEditContent();
      }
    }
  }

  private addEditContent() {
    this.selectedCategories = this.SelectedCategoryList; /*Add content with multiple categories*/
    this.fg.get('categoryList').setValue(this.selectedCategories);

    // validate video youtube link
    if (!this.is_youtubeVideoLink) {
      this.fg.get('youtube_VideoLink').setValue(null);
    }

    this.getContentObs()
      .map((value: Content) => {
        this.content = value;
        return value.id;
      })
      .flatMap((contentId: string) => {
        return this.getImageObservables(contentId);
      })
      .finally(() => {
        if (this.content) {
          if (this.isEpisode) {
            this.message = this.episode ? this.contentType === 'audio' ? 'Song updated successfully!!' : 'Episode updated successfully!!' :
              this.contentType === 'audio' ? 'Song added successfully!!' : 'Episode added successfully!!';
          } else {
            this.message = this.contentId ? this.contentType === 'audio' ? 'Album updated successfully!!' : 'Content updated successfully!!' :
              this.content.has_episode ? this.contentType === 'audio' ? 'Album added successfully, now you can add more songs!!' : 'Content added successfully, now you can add more episodes!!'
                : 'Content added successfully!!';
          }
          this.showDialog();
        }
      })
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
    } else if (this.content && this.isEpisode && !this.episode) {
      contentObs = this.service.addEpisode(this.parentId, this.fg.value);
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

    input.push(Observable.of(''));

    return Observable.concat(...input);
  }

  private showDialog() {
    this.visible = true;
  }

  private hideDialog() {
    this.visible = false;
  }

  onHide() {
    this.hideDialog();
    this.message = null;
    if (this.content) {
      /*1. After update content, if it has not episodes, redirected to content list page
        2. After update content, if it has episodes navigated to episode list page*/
      if (!this.content.has_episode && this.content.youtube_VideoLink && !this.content.parent_content_id) {
        this.router.navigate(['/admin/content', this.contentType]);
      } else {
        this.updateComplete.emit(this.content);
      }
    }
  }
}
