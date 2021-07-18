import { VideoPlayWrapper } from './../../../models/VideoPlayWrapper';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormGroupUtils } from './../../../common/utils/form-group-utils';
import { MessageService } from 'primeng/components/common/messageservice';
import { UserService } from './../../../services/user.service';
import { Content } from 'app/models/content';
import { PlayList } from 'app/models/PlayList';

@Component({
  selector: 'ss-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})
export class PlaylistComponent implements OnInit {

  playListId: string;
  playList: PlayList
  contentList: Content[];
  fg: FormGroup;
  showNewPlayListdialog: boolean = false;
  showdeletePlayListdialog: boolean = false;
  loading = true;
  updateLoading = false;
  showPlayer = false;
  playListForPlayer: VideoPlayWrapper;
  isPremium : boolean = false;

  constructor(fb: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute,
    private service: UserService, private messageService: MessageService) {
    this.fg = fb.group({
      name: fb.control('', [Validators.required])
    })
  }

  ngOnInit() {
    this.loading = true;

    this.activatedRoute.params.subscribe(params => {
      this.playListId = params['id'];
      this.getPlayList();
    })
  }

  getPlayList() {
    if (this.playListId) {
      this.service.getPlayList(this.playListId)
        .subscribe((response: PlayList[]) => {
          if (response) {
            this.playList = response[0];
            this.getMyPlayList();
            this.loading = false;
          }
        });
    }
  }

  editPlayList() {
    FormGroupUtils.applyValue(this.fg, this.playList);
    this.showNewPlayListdialog = true;
  }

  updatePlayList() {
    this.updateLoading = true;

    this.service.updatePlayList(this.playListId, this.fg.value)
      .subscribe((response: any) => {
        if (response.success) {
          this.fg.reset();
          this.messageService.add({ severity: 'success', summary: response.message, detail: '' });
          this.showNewPlayListdialog = false;
          this.service.reloadUserInfo();
          this.getPlayList();
          this.updateLoading = false;
        } else {
          this.fg.get('name').setValue('');
          this.fg.setErrors({ playlistaddedFailed: response.message });
          this.updateLoading = false;
        }
      });
  }

  deletePlayList() {
    this.updateLoading = true;
    this.service.deletePlayList(this.playList.id)
      .subscribe((response: any) => {
        if (response) {
          if (response.success) {
            this.showdeletePlayListdialog = false;
            this.service.reloadUserInfo();
            this.messageService.add({ severity: 'success', summary: response.message, detail: '' });
            this.router.navigate(['/session/home']);
          }
          else{
            this.showdeletePlayListdialog = false;
          }
        }
        this.updateLoading = false;
      });
  }

  getMyPlayList() {
    this.loading = true;
    this.service.getMyPlayList(this.playList.id)
      .subscribe((response: Content[]) => {
        if (response) {
          this.contentList = response;
          this.loading = false;
        }
      });
  }

  removeFromPlayList(content) {
    this.loading = true;
    this.service.removeContentFromPlayList(this.playList.id, content.id)
      .subscribe((response: any) => {
        if (response) {
          if (response.success) {
            this.service.reloadUserInfo();
            this.getMyPlayList();
            this.messageService.add({ severity: 'success', summary: '1 song deleted from ' + this.playList.name + '!', detail: '' });
            this.showPlayer = false;
          }
          this.loading = true;
        }
      });
  }

  playAll() {
    this.loading = true;
    this.service.playAll(this.playList.id)
      .subscribe((response: any) => {
        if (response) {
          if (response.success) {
            this.playListForPlayer = response;
            this.showPlayer = true;
          }
        }
        this.loading = false;
      });
  }

  premiumPlay(content) {
    if(content.is_premium) {
      this.isPremium = true;
    }
  }

}
