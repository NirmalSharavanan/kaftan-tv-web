import { SearchService } from './../../ss-core/search.service';
import { Observable } from 'rxjs/Observable';
import { ContentService } from 'app/services/content.service';
import { Subscription } from 'rxjs/Subscription';
import { Content } from 'app/models/content';
import { Blog } from 'app/models/blog';
import { Category } from 'app/models/Category';
import { OnInit, OnDestroy } from '@angular/core';

export class SearchBase implements OnInit, OnDestroy  {
    query: string = '';
    videoContents: Content[];
    audioContents: Content[];
    radioCategories: Category[];
    blogs: Blog[];
    channelCategories: Category[];
    subscription: Subscription;
    visiblityToggle: boolean = false;
    constructor(private service: ContentService, private searchService: SearchService) { }

    ngOnInit() {
        this.subscription = this.searchService.searchStatus
            .flatMap((display: boolean) => {
                if (display && this.query) {
                    const title = {
                                    title: this.query
                                   }
                    return this.service.searchSessionContent(title)
                } else {
                    return Observable.of(null);
                }
            })
            .subscribe((response: any) => {
                // console.log(response);
                if( response != null) {
                    this.videoContents = response[0];
                    this.audioContents = response[1];
                    this.radioCategories = response[2];
                    this.blogs = response[3];
                    this.channelCategories = response[4];
                }
            });
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

}
