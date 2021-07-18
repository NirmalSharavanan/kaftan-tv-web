import { JwtToken } from './../../../models/jwtToken';
import { AuthenticationService } from './../../../services/authentication.service';
import { SubscriptionService } from './../../../services/subscription.service';

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalConstants } from 'app/helper/api.constants';
import * as _swal from 'sweetalert';
import { SweetAlert } from 'sweetalert/typings/core';
const swal: SweetAlert = _swal as any;

@Component({
    moduleId: module.id,
    templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
    loading = false;
    fg: FormGroup;
    isAdmin = false;
    naviagte = null;

    constructor(
        fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private authenticationService: AuthenticationService,
        private service: SubscriptionService
    ) {
        this.fg = fb.group({
            email: fb.control('', [Validators.required]),
            password: fb.control('', [Validators.required, Validators.minLength(6)]),
        });
    }

    get password() {
        return this.fg.get('password');
    }
    get email() {
        return this.fg.get('email');
    }

    ngOnInit() {
        this.route.queryParamMap
            .subscribe((response: ParamMap) => {
                const url = response.get('navigate');
                if (url) {
                    this.naviagte = url;
                } else {
                    this.naviagte = null;
                }
            });
        // reset login status
        if (this.authenticationService.token) {
            this.router.navigate(['/session/home']);
        } else {
            this.route.queryParams.subscribe(params => {
                const accessToken = params['access_token'];

                if (accessToken) {
                    this.authenticationService.loginByToken(accessToken)
                        .finally(() => {
                            if (this.isAdmin) {
                                window.location.assign('/admin');
                            }
                        })
                        .subscribe((jwtToken: JwtToken) => {
                            this.processToken(jwtToken);
                        });
                }

            });
        }
        // this.authenticationService.logout();
    }

    login() {
        this.loading = true;
        this.authenticationService.login(this.email.value, this.password.value)
            .finally(() => {
                if (this.isAdmin) {
                    window.location.assign('/admin');
                }
            })
            .subscribe((jwtToken: JwtToken) => {
                swal({
                    title: 'Terms and Conditions',
                    text: 'This website terms and conditions template is for use on websites with typical features: informational pages, contact forms and user-submitted content.',
                  }).then((result) => {
                    this.processToken(jwtToken);
                  });
            });
    }

    processToken(jwtToken: JwtToken) {
        if (jwtToken && jwtToken.success) {

            const role = jwtToken.roles.filter(x => x === GlobalConstants.ADMIN_USER || x === GlobalConstants.ROLE_SUPER_USER)
            if (role && role.length > 0) {
                // this.router.navigate(['/admin']);
                this.isAdmin = true;
            }
            else {
                this.checkAndNavigate();
            }
        } else {
            this.fg.setErrors({ loginFailed: jwtToken.message });
            this.loading = false;
            window.scroll(0, 0);
        }
    }

    private checkAndNavigate() {
        if (this.naviagte) {
            this.router.navigate([this.naviagte]);
        } else {
            this.createFreeSubscription();
            this.router.navigate(['/session/home']);
        }
    }

    createFreeSubscription(){
        this.service.createFlexUser().subscribe((response: any) => {
            if (response) {
            }
          });
    }
}
