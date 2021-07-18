import { Component, OnInit } from '@angular/core';
import { PlayList } from './../../../models/PlayList';
import { User } from './../../../models/user';
import { UserService } from './../../../services/user.service';

@Component({
  selector: 'ss-my-playlist',
  templateUrl: './my-playlist.component.html',
  styleUrls: ['./my-playlist.component.scss']
})
export class MyPlaylistComponent implements OnInit {

  playList: PlayList[];
  loading = true;

  owlOptions = {
    stagePadding: 50,
    items: 5,
    dots: false,
    loop: false,
    lazyLoad: true,
    margin: 3,
    slideBy: 3,
    nav: true,
    navText: ['<span class=\'icon fa fa-angle-left\'></span>', '<span class=\'icon fa fa-angle-right\'></span>'],
    responsive: {
      0: {
        items: 1
      },
      300: {
        items: 2
      },
      600: {
        items: 2
      },
      800: {
        items: 3
      },
      1100: {
        items: 4
      },
      1300: {
        items: 5
      },
      1600: {
        items: 6
      }
    }
  };

  constructor(private service: UserService) { }

  ngOnInit() {
    this.getPlayList();
  }

  getPlayList() {
    this.loading = true;
    this.service.getLoggedInUser()
      .subscribe((response: User) => {
        if (response) {
          this.playList = response.playList;
        }
        this.loading = false;
      });
  }

}
