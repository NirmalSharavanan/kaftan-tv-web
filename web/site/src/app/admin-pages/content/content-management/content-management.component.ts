import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ArrayUtils } from 'app/common/utils/array-utils';
import { Router, ParamMap, UrlSegment } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Rx';

import { PageTitleService } from './../../../core/page-title/page-title.service';
import { ResponseBase } from './../../../models/responseBase';
import { MessageService } from 'primeng/components/common/messageservice';
import { ContentService } from './../../../services/content.service';
import { Content } from './../../../models/content';


enum ContentMode {
  CONTENT = 1,
  UPLOAD_AUDIO_VIDEO = 2,
  EPISODE = 3
}

enum EpisodeMode {
  EPISODE_ADD_EDIT = 1,
  EPISODE_UPLOAD_AUDIO_VIDEO = 2,
  EPISODE_LIST = 3
}

@Component({
  selector: 'ss-content-management',
  templateUrl: './content-management.component.html',
  styleUrls: ['./content-management.component.scss']
})
export class ContentManagementComponent implements OnInit {

  fg: FormGroup;
  content: Content;
  episode: Content;
  episodes: Content[];
  parentId: string;
  contentId: string;
  has_episode: boolean;
  is_youtubeVideoLink: boolean;
  is_episodeyoutubeVideoLink: boolean;
  isEpisode: boolean;
  orgOrder: string[];
  isSaveEnabled: boolean;
  mode: ContentMode = ContentMode.CONTENT;
  episodeMode: EpisodeMode = EpisodeMode.EPISODE_LIST;
  contentType: string;

  // Delete Episode
  displaydialog: boolean;
  episodeId: string;

  constructor(fb: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router,
    private service: ContentService, private messageService: MessageService) {
  }

  // Callback function after add/edit content (or) episode complete
  updateComplete($event) {

    this.contentId = $event.parent_content_id ? $event.parent_content_id : $event.id;

    this.init();

    if ($event.parent_content_id) {
      if ($event.youtube_VideoLink) {
        this.episode = null;
        this.is_episodeyoutubeVideoLink = true;
        this.episodeMode = EpisodeMode.EPISODE_LIST;
      } else {
        this.is_episodeyoutubeVideoLink = false;
        this.episodeMode = EpisodeMode.EPISODE_UPLOAD_AUDIO_VIDEO;
        this.episode = $event;
      }
    } else {
      // if (!$event.has_episode && $event.youtube_VideoLink) {
      //   this.naviagteBack();
      // }
      if (!$event.has_episode && !$event.youtube_VideoLink) {
        this.is_youtubeVideoLink = false;
        this.mode = ContentMode.UPLOAD_AUDIO_VIDEO;
        this.content = $event;
      } else if ($event.has_episode && !$event.youtube_VideoLink) {
        this.has_episode = true;
        this.mode = ContentMode.EPISODE;
        this.episodeMode = EpisodeMode.EPISODE_ADD_EDIT;
        this.content = $event;
      }
    }
  }

  // Callback function after upload video for episode
  uploadComplete($event) {
    this.contentId = $event.parent_content_id ? $event.parent_content_id : $event.id;

    this.init();

    this.episode = null;

    if ($event.parent_content_id) {
      this.episodeMode = EpisodeMode.EPISODE_LIST;
    }
  }

  ngOnInit() {
    this.init();
  }

  private init() {
    this.activatedRoute.paramMap
      .map((value: ParamMap) => {
        if (this.contentId) {
          return this.contentId;
        } else {
          return this.applyMapParam(value);
        }
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
          if (response[0].has_episode) {
            this.has_episode = true;
            this.episodes = response[1];
            this.orgOrder = this.episodes.map((content: Content) => content.id);
          }
          if (response[0].youtube_VideoLink != null) {
            this.is_youtubeVideoLink = true;
          }
        }
      });
  }

  private applyMapParam(value: ParamMap) {
    this.contentId = value.get('contentId');
    this.contentType = value.get('type');
    return this.contentId;
  }

  public naviagteBack() {
    this.router.navigate(['/admin/content', this.contentType]);
  }

  private navigateToAddEpisode() {
    this.episode = null;
    this.episodeMode = EpisodeMode.EPISODE_ADD_EDIT;
  }

  private navigateToEditEpisode(episode) {
    this.episode = episode;
    this.is_episodeyoutubeVideoLink = episode.youtube_VideoLink ? true : false;
    this.episodeMode = EpisodeMode.EPISODE_ADD_EDIT;
  }

  enableSave() {
    this.isSaveEnabled = true;
  }

  onReorder() {
    this.service.reorderEpisode(this.contentId, ArrayUtils.reOrderInput(this.episodes, this.orgOrder))
      .subscribe((response: ResponseBase) => {
        if (response.success) {
          this.isSaveEnabled = false;
          this.init();
          this.messageService.add({ severity: 'success', summary: 'Re-Ordering Successful!', detail: response.message });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Re-Ordering Failed!', detail: response.message });
        }
      });
  }

  private showDeleteDialog(episodeId) {
    this.episodeId = episodeId;
    this.displaydialog = true;
  }

  deleteEpisode(episodeId) {
    this.displaydialog = false;
    this.service.deleteContent(episodeId)
      .subscribe((response: any) => {
        if (response) {
          if (response.success) {
            this.init();
            if (this.episode) {
              if (this.episode.id === episodeId) {
                this.episode = null;
              }
            }
            this.messageService.add({ severity: 'info', summary: this.content.content_type === 'audio' ? 'Song deleted successfully!!' : 'Episode deleted successfully!!', detail: '' });
          }
        }
      });
  }
}
