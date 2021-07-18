import { UserRolesService } from './services/user-roles.service';
import { UserRole } from './models/user-role';
import { JwtToken } from './models/jwtToken';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from './services/authentication.service';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AdminAuthGuard implements CanActivate {

    constructor(private router: Router,
        private userRolesService: UserRolesService,
        private authenticationService: AuthenticationService) {

    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const user: JwtToken = this.authenticationService.getUser();

       if (user && this.checkRoles(user.roles, state.url )) {
            return true;
        }

        this.router.navigate(['/']);
        return false;
    }

    private checkRoles(roles: string[], url: string): boolean {
        for (const role of roles) {
            var url_string = url;
            const userRole: UserRole = this.userRolesService.getUserRole(role);
            if (userRole) {
                for (const state of userRole.states) {
                    var subStr = url_string.substring(url_string.lastIndexOf("/"), url_string.length);
                    if( userRole.states.toString().indexOf(subStr) === -1 ) {
                        url_string = url_string.replace(subStr, '');
                    } else {
                        if (state === url_string.substring(1)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

}
