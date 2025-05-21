import { Injectable } from '@angular/core'
import { CanActivate, Router, UrlTree } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { Observable, of } from 'rxjs'
import { catchError, map } from 'rxjs/operators'
import { GlobalService } from '../services/global.service'

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(
        private http: HttpClient,
        private router: Router,
        private globalService: GlobalService
    ) {}

    canActivate(): Observable<boolean | UrlTree> {
        return this.http
            .get(`${this.globalService.apiUrl}/login`, {
                withCredentials: true,
            })
            .pipe(
                map((response: any) => {
                    if (response.state === true) {
                        return true
                    } else {
                        return this.router.parseUrl('/login')
                    }
                }),
                catchError(() => {
                    return of(this.router.parseUrl('/login'))
                })
            )
    }
}
