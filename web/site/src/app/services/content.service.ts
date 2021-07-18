import { AWSUploadStatus } from './../models/awsUploadStatus';
import { ReOrder } from 'app/models/re-order';
import { Category } from './../models/Category';
import { CategoryService } from './category.service';
import { AuthenticationService } from './authentication.service';
import { FILE_UPLOAD_PROGRESS } from './../helper/api.constants';
import { Observable } from 'rxjs/Observable';
import { HttpService } from 'app/helper/httpService';
import { Content } from './../models/content';
import { RestAPI } from 'app/helper/api.constants';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/publishReplay';
import { UserService } from './user.service';
import { ContentWatchHistory } from './../models/contentWatchHistory';

@Injectable()
export class ContentService extends HttpService {

  private map = new Map<string, Observable<any>>();

  constructor(http: HttpClient,
    private authenticationService: AuthenticationService,
    private categoryService: CategoryService,
    private userService: UserService) {
    super(http);
  }
  getAllContents(contentType: string) {
    return this.get(RestAPI.GET_ALL_CONTENT + '/' + contentType);
  }
  getContentForAdmin(contentId: string) {
    return this.get(RestAPI.GET_ADMIN_CONTENT + '/' + contentId);
  }
  getContent(contentId: string, isCache: boolean) {
    if (isCache) {

      if (!this.map.has(contentId)) {
        const obsev = this.get(RestAPI.GET_CONTENT + '/' + contentId)
          .publishReplay(1)
          .refCount();
        this.map.set(contentId, obsev);

        return obsev;

      } else {
        return this.map.get(contentId);
      }
    } else {
      return this.get(RestAPI.GET_CONTENT + '/' + contentId);
    }
  }
  getContentToWatch(contentId: string, generate: boolean) {
    return this.get(RestAPI.GET_CONTENT_TO_PLAY + '/' + contentId + '/' + generate);
  }
  updateContent(content: Content) {
    return this.put(RestAPI.PUT_UPDATE_CONTENT + '/' + content.id, content);
  }
  deleteContent(contentId: string) {
    return this.delete(RestAPI.DELETE_CONTENT + '/' + contentId);
  }
  getAssignedContents(categoryId: string) {
    return this.get(RestAPI.GET_ASSINED_CONTENT + '/' + categoryId);
  }
  getAdminAssignedContents(categoryId: string) {
    return this.get(RestAPI.GET_ADMIN_ASSINED_CONTENT + '/' + categoryId);
  }
  getUnAssignedContents(categoryId: string) {
    return this.get(RestAPI.GET_ADMIN_UNASSINED_CONTENT + '/' + categoryId);
  }
  addContent(content: Content) {
    return this.post(RestAPI.POST_CREATE_CONTENT, content);
  }
  mapContentToCategory(categoryId: string, contentIdList: string[]) {
    return this.put(RestAPI.PUT_MAP_CONTENT_TO_CATEGORY + '/' + categoryId, contentIdList)
  }
  removeContentToCategoryMapping(categoryId: string, contentIdList: string[]) {
    return this.put(RestAPI.PUT_REMOVE_CONTENT_CATEGORY_MAPPING + '/' + categoryId, contentIdList)
  }
  reorder(categoryId: string, ordered: ReOrder[]) {
    return this.put(RestAPI.PUT_CONTENT_RE_ORDDER + '/' + categoryId + '/content-re-order', ordered);
  }
  updateThumbnail(categoryId: string, formData: FormData) {
    return this.put(RestAPI.PUT_UPDATE_THUMNAIL + '/' + categoryId, formData, FILE_UPLOAD_PROGRESS);
  }
  updateVideo(categoryId: string, formData: FormData) {
    return this.put(RestAPI.PUT_UPDATE_VIDEO + '/' + categoryId, formData, FILE_UPLOAD_PROGRESS);
  }
  updateTailer(categoryId: string, formData: FormData) {
    return this.put(RestAPI.PUT_UPDATE_TRAILER + '/' + categoryId, formData, FILE_UPLOAD_PROGRESS);
  }
  updateBanner(categoryId: string, formData: FormData) {
    return this.put(RestAPI.PUT_UPDATE_BANNER + '/' + categoryId, formData, FILE_UPLOAD_PROGRESS);
  }
  // Episode
  getAllEpisodesForAdmin(contentId: string) {
    return this.get(RestAPI.GET_ADMIN_EPISODE + '/' + contentId);
  }
  // getEpisode(contentId: string, episodeId: string) {
  //   return this.get(RestAPI.GET_EPISODE + '/' + contentId + '/' + episodeId);
  // }
  addEpisode(contentId: string, episode: Content) {
    return this.post(RestAPI.POST_CREATE_EPISODE + '/' + contentId, episode);
  }
  reorderEpisode(contentId: string, ordered: ReOrder[]) {
    return this.put(RestAPI.PUT_EPISODE_RE_ORDER + '/' + contentId + '/episode-re-order', ordered);
  }
  getAllEpisodes(contentId: string) {
    return this.get(RestAPI.GET_EPISODE + '/' + contentId);
  }
  searchContent(contentType: string, searchTitle, searchDate) {
    return this.get(RestAPI.GET_ALL_ADMIN_CONTENT_BY_SEARCH + '/' + contentType + '?searchTitle=' + searchTitle + '&searchDate=' + searchDate);
  }

  searchSessionContent(searchData: any) {
    return this.post(RestAPI.GET_ALL_CONTENT_BY_SEARCH, searchData);
  }

  updateS3UploadStatus(contentId, awsUploadStatus: AWSUploadStatus) {
    return this.put(RestAPI.PUT_S3_UPLOAD_STATUS + contentId, awsUploadStatus);
  }

  // Continue Watching
  addContentToWatchHistory(contentWatchHistory: ContentWatchHistory) {
    return this.post(RestAPI.POST_CONTENT_TO_WATCH_HISTORY, contentWatchHistory);
  }

  getContentToWatchHistory() {
    return this.get(RestAPI.GET_ALL_WATCH_HISTORY);
  }

  getPrice(content: Content) {
    
    if (!content.payperviewCategoryId) {
      return Observable.of(0);
    } else {
      return this.getUserObservable(content.id)
        .flatMap(isUserPaid => {
          if (isUserPaid) {
            return Observable.of(null);
          } else {
            return this.categoryService.getCategory(content.payperviewCategoryId, true);
          }
        })
        .concatMap((response: Category) => {

          if (response != null) {
            if (this.authenticationService.isPremiumUser()) {
              return Observable.of(response.premium_price);
            } else {
              return Observable.of(response.price);
            }
          } else {
            return Observable.of(0);
          }
        });

    }

  }

  // getPremiumUser(content: Content) {
  //   if (!content.payperviewCategoryId) {
  //     return this.getUserSubscriptionObservable()
  //       .flatMap(isUserPaid => {
  //         if(isUserPaid) {
  //           return Observable.of(isUserPaid);
  //         } else {
  //           return Observable.of(isUserPaid);
  //         }
  //       });
  //   }
  // }

  private getUserObservable(id) {
    if (!this.authenticationService.token) {
      return Observable.of(false);
    }
    return this.userService.isUserPaidForContent(id);
  }

  // private getUserSubscriptionObservable() {
  //   if (!this.authenticationService.token) {
  //     return Observable.of(false);
  //   }
  //   return this.userService.isUserSubscribed("Video On Demand");
  // }
  
}
