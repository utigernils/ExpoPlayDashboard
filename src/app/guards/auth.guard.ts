import { Injectable } from '@angular/core'
import { CanActivate, Router, UrlTree } from '@angular/router'
import { AuthService } from '../services/auth.service'

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router
    ) {}

    canActivate(): boolean | UrlTree {
        console.log('AuthGuard: Checking authentication')
        console.log(
            'AuthGuard: User is ' +
                (this.authService.isAuthenticated()
                    ? 'authenticated'
                    : 'not authenticated')
        )

        if (this.authService.isAuthenticated()) {
            return true
        } else {
            return this.router.parseUrl('/login')
        }
    }
}
