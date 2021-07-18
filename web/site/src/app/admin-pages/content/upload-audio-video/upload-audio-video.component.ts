import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ParamMap, UrlSegment } from '@angular/router';
import { MessageService } from 'primeng/components/common/messageservice';
import { ContentService } from './../../../services/content.service';
import { Content } from './../../../models/content';
import { QualityType } from './../../../aws/model/QualityType';

@Component({
    selector: 'ss-upload-audio-video',
    templateUrl: './upload-audio-video.component.html',
    styleUrls: ['./upload-audio-video.component.scss']
})

export class UploadAudioVideoComponent implements OnInit {
    fg: FormGroup;
    @Input() content: Content;
    contentId: string;
    video: File | null;
    video360p: File | null;
    video480p: File | null;
    video720p: File | null;
    video1080p: File | null;
    startVideoUpload: boolean;
    start360VideoUpload: boolean;
    start480VideoUpload: boolean;
    start720VideoUpload: boolean;
    start1080VideoUpload: boolean;
    // has_episode: boolean;
    // is_youtubeVideoLink: boolean;

    // preview video
    preview: boolean;
    videoUrl: string;
    aws360VideoUrl: string;
    aws480VideoUrl: string;
    aws720VideoUrl: string;
    aws1080VideoUrl: string;

    // check complete uploading
    uploaded360p: boolean;
    uploaded480p: boolean;
    uploaded720p: boolean;
    uploaded1080p: boolean;
    @Output()
    uploadComplete: EventEmitter<any> = new EventEmitter<any>();

    // display alert
    message: string;
    visible: boolean;

    constructor(fb: FormBuilder, private service: ContentService, private messageService: MessageService, private router: Router) {
        this.fg = fb.group({
            is_uploadCompressed: fb.control(false, []),
        });
    }

    get is_uploadCompressed() {
        return this.fg.get('is_uploadCompressed').value;
    }

    ngOnInit() {
        this.init();
    }

    private init() {
        if (this.content) {
            this.applyResponse(this.content);
        }
    }

    private applyResponse(response: Content) {
        this.content = response;
        this.contentId = this.content.id;

        // if (response.has_episode) {
        //     this.has_episode = true;
        // }
        // if (response.youtube_VideoLink != null) {
        //     this.is_youtubeVideoLink = true;
        // }
        if (this.content._links && !response.useEncoding) {
            this.aws360VideoUrl = this.content._links.aws360VideoUrl ? this.content._links.aws360VideoUrl.href : null;
            this.aws480VideoUrl = this.content._links.awsContentUrl ? this.content._links.awsContentUrl.href : null;
            this.aws720VideoUrl = this.content._links.aws720VideoUrl ? this.content._links.aws720VideoUrl.href : null;
            this.aws1080VideoUrl = this.content._links.aws1080VideoUrl ? this.content._links.aws1080VideoUrl.href : null;
        }
        if (!response.useEncoding && this.aws360VideoUrl || this.aws480VideoUrl || this.aws720VideoUrl) {
            this.fg.get('is_uploadCompressed').setValue(true);
        }
    }

    uploadVideo() {
        // audio upload
        if (this.content && this.content.content_type === 'audio') {
            if (this.video480p) {
                this.start480VideoUpload = true;
            }
            else {
                this.messageService.add({ severity: 'error', summary: 'Please upload audio', detail: '' });
            }
        }
        // compressed video upload
        else if (this.is_uploadCompressed && this.content.content_type === 'video') {
            if (this.video360p && this.video480p && this.video720p) {
                this.start360VideoUpload = true;
                this.start480VideoUpload = true;
                this.start720VideoUpload = true;
                if (this.video1080p) {
                    this.start1080VideoUpload = true;
                }
            } else {
                this.messageService.add({ severity: 'error', summary: 'Please upload all the 360p, 480p & 720p video', detail: '' });
            }
        }
        // original video upload
        else {
            if (this.video) {
                this.startVideoUpload = true;
            } else {
                this.messageService.add({ severity: 'error', summary: 'Please upload video', detail: '' });
            }
        }
    }

    // Call back function after uploadded video
    onComplete($event) {
        if ($event === QualityType.ORIGINAL) {
            this.message = 'Video uploaded successfully!!';
            this.showDialog();
        }
        if ($event === QualityType.P_360) {
            this.uploaded360p = true;
        }
        if ($event === QualityType.P_480) {
            this.uploaded480p = true;
        }
        if ($event === QualityType.P_720) {
            this.uploaded720p = true;
        }
        if ($event === QualityType.P_1080) {
            this.uploaded1080p = true;
        }
        if (this.uploaded480p && this.content && this.content.content_type === 'audio') {
            this.message = 'Audio uploaded successfully!!';
            this.showDialog();
        }
        if (this.uploaded360p && this.uploaded480p && this.uploaded720p) {
            if (this.start1080VideoUpload) {
                if (this.uploaded1080p) {
                    this.message = 'Video uploaded successfully!!';
                    this.showDialog();
                }
            } else {
                this.message = 'Video uploaded successfully!!';
                this.showDialog();
            }

        }
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
            /*1. After uploaded video to main content, redirected to content list page
              2. After uploaded video to episode, navigated to episode list page*/
            if (this.content.parent_content_id) {
                this.uploadComplete.emit(this.content);
            } else {
                this.router.navigate(['/admin/content', this.content.content_type]);
            }
        }
    }

    playPreview(videoUrlParam: string) {
        this.videoUrl = videoUrlParam;
        this.preview = true;
    }
}
