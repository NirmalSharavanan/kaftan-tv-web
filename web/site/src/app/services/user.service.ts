import { RestAPI } from './../helper/api.constants';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AuthenticationService } from './authentication.service';
import { UrlUtils } from 'app/common/utils/url-utils';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/publishReplay';
import { User } from '../models/user';
import { Content } from '../models/content';
import { PlayList } from '../models/PlayList';
import { HttpService } from '../helper/httpService';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserService extends HttpService {

    localUser: Observable<User>;
    private userUpdateStatus: BehaviorSubject<User>;
    localUserState: Observable<User>;
    private isPremiumUpdateStatus: BehaviorSubject<any>;
    localPremiumUserState: Observable<any>;
    userSubscription: Observable<any>;

    constructor(http: HttpClient) {
        super(http);
        this.userUpdateStatus = new BehaviorSubject<User>(null);
        this.localUserState = this.userUpdateStatus.asObservable();
        this.isPremiumUpdateStatus = new BehaviorSubject<any>(null);
        this.localPremiumUserState = this.isPremiumUpdateStatus.asObservable();
    }

    getLoggedInUser(): Observable<User> {
        // get users from api

        if (!this.localUser) {
            this.getLocalUserFromServer();
        }

        return this.localUser;
    }

    getPremiumUser(): Observable<any> {
        // get subscribed users

        if(!this.userSubscription) {
            this.getLocalUserSubscription();
        }

        return this.userSubscription;
    }

    // Use this whenever user information is upadated
    // like update to favorites, purchased a content, upgraded to premium, updated profile

    reloadUserInfo() {
        this.getLocalUserFromServer()
            .subscribe((user: User) => {
                if (user) {
                    // get subscription info

                    this.getLocalUserSubscription()
                        .subscribe((userSubscription: any) => {
                            if (userSubscription) {
                                localStorage.setItem('is_premium', userSubscription.length > 0 ? 'true' : 'false');
                                this.isPremiumUpdateStatus.next(userSubscription);
                            }
                        });
                    this.userUpdateStatus.next(user);
                }

            });
    }

    keepAlive(token: String) {
        return this.get(RestAPI.KEEP_ALIVE + token + '/');
    }


    private getLocalUserFromServer() {
        this.localUser = this.get<User>(RestAPI.GET_LOGEDDIN_USER)
            .publishReplay(1)
            .refCount();

        return this.localUser;
    }

    private getLocalUserSubscription() {
        this.userSubscription = this.get(RestAPI.GET_USER_SUBSCRIPTION)
        .publishReplay(1)
        .refCount();

        return this.userSubscription;
    }

    isUserPaidForContent(contentId: string) {
        if (!this.localUser) {
            this.getLocalUserFromServer();
        }
        
        return this.localUser
            .map((user: User) => {
                return this.isUserPaid(contentId, user)
            });
    }

    isUserSubscribed(feature: string) {
        if(!this.userSubscription) {
            this.getLocalUserSubscription();
        }

        return this.userSubscription
            .map((premiumFeatures: any) => {
                return this.isSubscribedFeature(feature, premiumFeatures);
            })
    }

    private isUserPaid(content_id, user: User) {

        if (user.paymentInfo) {

            if (user.paymentInfo.paymentCompletedList && user.paymentInfo.paymentCompletedList.length > 0) {
                const paymentCompleted = user.paymentInfo.paymentCompletedList
                    .find(payCompleted => payCompleted.product_reference_id === content_id);

                if (paymentCompleted && paymentCompleted.product_reference_id) {
                    return true;
                } else {
                    return false;
                }

            } else {
                return false;
            }

        } else {
            return false;
        }
    }

    private isSubscribedFeature(feature, userSubscription) {
        if(userSubscription && userSubscription.length > 0) {
            if(userSubscription[0].subscriptionInfo.features.includes(feature)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    getUser(id: string) {
        return this.get(RestAPI.GET_USER + '/' + id);
    }

    getUserByAccessToken(token: string) {
        return this.get(UrlUtils.formatUrl(RestAPI.GET_USER_BY_TOKEN, token));
    }

    updateUser(name: string, email: string, mobileNo: string, userId: string) {
        return this.put(RestAPI.PUT_USER + '/' + userId, { name: name, email: email, mobileNo: mobileNo });
    }

    changePassword(user: User) {
        return this.post(RestAPI.CHANGE_PASSWORD, user);
    }

    addContentToFavorite(content: Content) {
        return this.put(RestAPI.PUT_FAVORITE_CONTENT + '/' + content.id, null);
    }

    removeContentFromFavorite(content: Content) {
        return this.put(RestAPI.DELETET_FAVORITE_CONTENT + '/' + content.id, null);
    }

    getFavoriteContent(content_id: string) {
        if (!this.localUser) {
            this.getLocalUserFromServer();
        }
        return this.localUser
            .map((user: User) => {
                return this.isFavoriteContent(user, content_id);
            });
    }

    private isFavoriteContent(user: User, content_id) {
        if (user.favorites) {
            if (user.favorites.length > 0) {
                const isFavorite = user.favorites.find(x => x === content_id);
                if (isFavorite && isFavorite !== '') {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }

        } else {
            return false;
        }
    }

    getFavoriteContentList() {
        return this.get(RestAPI.GET_MY_FAVORITE_CONTENT);
    }

    // Add to PlayList
    addPlayList(playList: PlayList) {
        return this.put(RestAPI.POST_NEW_PLAYLIST, playList);
    }
    updatePlayList(playListId: string, playList: PlayList) {
        console.log(playList.id);
        return this.put(RestAPI.PUT_PLAYLIST + '/' + playListId, playList);
    }
    deletePlayList(playListId: string) {
        return this.put(RestAPI.DELETE_PLAYLIST + '/' + playListId, null);
    }
    addContentToPlayList(playListId: string, contentId: string) {
        return this.put(RestAPI.PUT_PLAYLIST_CONTENT + '/' + playListId + '/' + contentId, null);
    }
    removeContentFromPlayList(playListId: string, contentId: string) {
        return this.put(RestAPI.DELETE_PLAYLIST_CONTENT + '/' + playListId + '/' + contentId, null);
    }
    getMyPlayList(playListId: string) {
        return this.get(RestAPI.GET_MY_PLAYLIST + '/' + playListId);
    }
    getPlayList(playListId: string) {
        if (!this.localUser) {
            this.getLocalUserFromServer();
        }
        return this.localUser
            .map((user: User) => {
                if (user.playList) {
                    return user.playList.filter(x => x.id === playListId);
                }
            });
    }
    playAll(playListId: string) {
        return this.get(RestAPI.GET_AUDIOURL_TO_PLAY_ALL + '/' + playListId);
    }


    addAdminUsers(user: User) {
        return this.post(RestAPI.POST_ADMIN_USER, user);
    }

    getAdminUsers() {
        return this.get(RestAPI.GET_ALL_ADMIN_USER);
    }

    getAllRoles() {
        return this.get(RestAPI.GET_ALL_ROLES);
    }

    getSignupUsers() {
        return this.get(RestAPI.GET_ALL_SIGNUP_USER);
    }
    
    updateAdminUsers(user: User) {
        return this.put(RestAPI.PUT_ADMIN_USER + '/' + user.id, user);
    }


    // Content Analytics
    getContentUsageHistoryByUser(from_date: Date, to_date: Date, search_bydate: boolean) {
        return this.get(RestAPI.GET_ALL_CONTENT_USAGE_HISTORY_BY_USER + '/' + from_date + '/' + to_date + '/' + search_bydate);
    }

    getContentUsageHistoryByMovie(from_date: Date, to_date: Date, search_bydate: boolean) {
        return this.get(RestAPI.GET_ALL_CONTENT_USAGE_HISTORY_BY_MOVIE + '/' + from_date + '/' + to_date + '/' + search_bydate);
    }

    getContentUsageHistoryTotal(from_date: Date, to_date: Date, search_bydate: boolean) {
        return this.get(RestAPI.GET_CONTENT_USAGE_HISTORY_TOTAL + '/' + from_date + '/' + to_date + '/' + search_bydate);
    }

    //Notifications
    uploadImage(formData: FormData) {
        return this.post(RestAPI.POST_EMAIL_IMAGE, formData);
    }

    sendEmail(formData: FormData) {
        return this.post(RestAPI.SEND_EMAIL, formData);
    }
 
    sendNotification(formData: FormData) {
        return this.post(RestAPI.SEND_NOTIFICATION, formData);
    }

    addPushNotification(formData: FormData) {
        return this.post(RestAPI.POST_PUSH_NOTIFICATION, formData);
    }

    getPushNotification() {
        return this.get(RestAPI.GET_PUSH_NOTIFICATION);
    }

}
