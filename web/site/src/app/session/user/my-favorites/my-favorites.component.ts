import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './../../../services/authentication.service';
import { UserService } from './../../../services/user.service';
import { Content } from 'app/models/content';

@Component({
  selector: 'ss-my-favorites',
  templateUrl: './my-favorites.component.html',
  styleUrls: ['./my-favorites.component.scss']
})
export class MyFavoritesComponent implements OnInit {

  loading = true;
  contentList: Content[];

  constructor(private router: Router, private authService: AuthenticationService, private service: UserService) { }

  ngOnInit() {
    if (this.authService.token) {
      this.getMyFavorites();
    }
    else {
      this.router.navigateByUrl('/session/home');
    }
  }

  getMyFavorites() {
    this.loading = true;
    this.service.getFavoriteContentList()
      .subscribe((response: any) => {
        if (response) {
          this.loading = false;
          this.contentList = response;
        }
      });
  }

  removeFromFavorite(content) {
    this.loading = true;
    this.service.removeContentFromFavorite(content)
      .subscribe((response: any) => {
        if (response) {
          if (response.success) {
            this.service.reloadUserInfo();
            this.getMyFavorites();
          }
        }
        this.loading = false;
      });
  }

}
