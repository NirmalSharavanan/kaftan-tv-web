import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Content } from 'app/models/content';
import { User } from './../../../models/user';
import { PlayList } from './../../../models/PlayList';
import { UserService } from './../../../services/user.service';
import { AuthenticationService } from './../../../services/authentication.service';
import { MessageService } from 'primeng/components/common/messageservice';

@Component({
  selector: 'ss-add-to-playlist',
  templateUrl: './add-to-playlist.component.html',
  styleUrls: ['./add-to-playlist.component.scss']
})
export class AddToPlaylistComponent implements OnInit {

  @Input() pageType: string;
  @Input() content: Content;
  isAuthenticated: boolean;
  isInvalidUser: boolean;
  loading = false;
  fg: FormGroup;
  playList: PlayList[];

  // Add to Playlist
  showPlayListdialog: boolean = false;
  showNewPlayListdialog: boolean = false;

  constructor(fb: FormBuilder, private service: UserService,
    private authService: AuthenticationService, private messageService: MessageService) {
    this.fg = fb.group({
      name: fb.control('', [Validators.required])
    })
  }

  ngOnInit() {
    this.init();
  }

  init() {
    this.authService.isUserAuthenticated()
      .subscribe((isAuth: boolean) => {
        this.isAuthenticated = isAuth;

        if (this.isAuthenticated) {
          this.getPlayList();
        }

      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.content.previousValue != null && changes.content.previousValue.id !== changes.content.currentValue.id) {
      this.init();
    }
  }

  playListDialog() {
    if (this.isAuthenticated) {
      this.getPlayList();
      this.showPlayListdialog = true;
      this.isInvalidUser = false;
      this.fg.reset();
    }
    else {
      this.isInvalidUser = true;
    }
  }

  newPlayListDialog() {
    this.showNewPlayListdialog = true;
    this.fg.reset();
  }

  getPlayList() {
    this.loading = true;
    this.service.getLoggedInUser()
      .subscribe((response: User) => {
        if (response) {
          this.playList = response.playList;
          this.loading = false;
        }
      });
  }

  addPlayList() {
    this.loading = true;

    this.service.addPlayList(this.fg.value)
      .subscribe((response: any) => {
        if (response.success) {
          this.fg.reset();
          this.fg.setErrors({ playlistaddedSuccess: response.message });
          this.showNewPlayListdialog = false;
          this.service.reloadUserInfo();
          this.getPlayList();
        } else {
          this.fg.get('name').setValue('');
          this.fg.setErrors({ playlistaddedFailed: response.message });
          this.showNewPlayListdialog = false;
        }
        this.loading = false;
      });
  }

  addContentToPlayList(playlist) {
    this.service.addContentToPlayList(playlist.id, this.content.id)
      .subscribe((response: any) => {
        if (response.success) {
          this.fg.reset();
          this.showPlayListdialog = false;
          this.getPlayList();
          this.service.reloadUserInfo();
          this.messageService.add({ severity: 'success', summary: this.content.title + ' added successfully in ' + playlist.name + '!', detail: '' });
        } else {
          this.fg.reset();
          this.showPlayListdialog = false;
          this.messageService.add({ severity: 'error', summary: this.content.title + ' is already exists in ' + playlist.name + '!', detail: '' });
        }
        this.loading = false;
      });
  }

}
