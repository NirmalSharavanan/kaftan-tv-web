import { Component, OnInit, OnDestroy, ViewChild, HostListener, ViewEncapsulation } from '@angular/core';
import { MenuItems } from '../../core/menu/menu-items/menu-items';
import { PageTitleService } from '../../core/page-title/page-title.service';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { MediaChange, ObservableMedia } from "@angular/flex-layout";
import {
    PerfectScrollbarConfigInterface,
    PerfectScrollbarComponent, PerfectScrollbarDirective
} from 'ngx-perfect-scrollbar';
import PerfectScrollbar from 'perfect-scrollbar';
const screenfull = require('screenfull');

@Component({
    selector: 'silk-layout',
    templateUrl: './admin-material.html',
    styleUrls: ['./admin-material.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AdminComponent implements OnInit, OnDestroy {

    private _router: Subscription;
    header: string;
    currentLang = 'en';
    url: string;
    showSettings = false;
    dark: boolean;
    boxed: boolean;
    collapseSidebar: boolean;
    compactSidebar: boolean;
    customizerIn: boolean = false;
    headerGreen: boolean = false;
    headerRed: boolean = false;
    headerYellow: boolean = false;
    root = 'ltr';
    chatpanelOpen: boolean = false;
    themeHeaderSkinColor: any = "header-default";
    themeSidebarSkinColor: any = "sidebar-default";

    private _mediaSubscription: Subscription;
    sidenavOpen: boolean = true;
    sidenavMode: string = 'side';
    isMobile: boolean = false;
    private _routerEventsSubscription: Subscription;

    @ViewChild('sidenav') sidenav;

    constructor(public menuItems: MenuItems, private pageTitleService: PageTitleService, private router: Router,
        private media: ObservableMedia) {
    }

    ngOnInit() {
        this.pageTitleService.title.subscribe((val: string) => {
            this.header = val;
        });

        this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
            this.url = event.url;
        });

        if (this.url != '/session/login' && this.url != '/session/register' && this.url != '/session/forgot-password' && this.url != '/session/lockscreen') {
            const elemSidebar = <HTMLElement>document.querySelector('.sidebar-container ');


            if (window.matchMedia(`(min-width: 960px)`).matches) {
                const ps = new PerfectScrollbar(elemSidebar, {
                    wheelSpeed: 2,
                    suppressScrollX: true
                });

            }
        }
        if (this.media.isActive('xs') || this.media.isActive('sm')) {
            this.sidenavMode = 'over';
            this.sidenavOpen = false;

        }
        this._mediaSubscription = this.media.asObservable().subscribe((change: MediaChange) => {
            let isMobile = (change.mqAlias == 'xs') || (change.mqAlias == 'sm');

            this.isMobile = isMobile;
            this.sidenavMode = (isMobile) ? 'over' : 'side';
            this.sidenavOpen = !isMobile;
        });

        this._routerEventsSubscription = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd && this.isMobile) {
                this.sidenav.close();
            }
        });
    }

    navigate(name: string, state: string) {
        this.pageTitleService.setTitle(name);
        this.router.navigate(['/' + state]);
    }

    navigateToKaftanPay(name: string, state: string) {
        this.pageTitleService.setTitle(name);
        this.router.navigate([state + '/wallet/home']);
    }

    ngOnDestroy() {
        this._router.unsubscribe();
        this._mediaSubscription.unsubscribe();
    }

    isFullscreen: boolean = false;

    menuMouseOver(): void {
        if (window.matchMedia(`(min-width: 960px)`).matches && this.collapseSidebar) {
            this.sidenav.mode = 'over';
        }
    }

    menuMouseOut(): void {
        if (window.matchMedia(`(min-width: 960px)`).matches && this.collapseSidebar) {
            this.sidenav.mode = 'side';
        }
    }

    toggleFullscreen() {
        if (screenfull.enabled) {
            screenfull.toggle();
            this.isFullscreen = !this.isFullscreen;
        }
    }

    customizerFunction() {
        this.customizerIn = !this.customizerIn;
    }
    headerSkinColorFunction(color) {
        this.themeHeaderSkinColor = color;
    }
    sidebarSkinColorFunction(color) {
        this.themeSidebarSkinColor = color;
    }
    addMenuItem(): void {
        // this.menuItems.add({
        //     state: 'error',
        //     name: 'SILK MENU',
        //     type: 'sub',
        //     icon: 'trending_flat',
        //     children: [
        //         { state: '404', name: 'SUB MENU1' },
        //         { state: '404', name: 'SUB MENU2' }
        //     ]
        // });
    }

    onActivate(e, scrollContainer) {
        scrollContainer.scrollTop = 0;
    }

}


