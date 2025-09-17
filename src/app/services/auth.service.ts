import { Injectable, signal } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { GlobalService } from './global.service'
import { Router } from '@angular/router'

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private isAuthenticatedSubject = false

    constructor(
        private http: HttpClient,
        private globalService: GlobalService,
        private router: Router
    ) {}


    login(email: string, password: string) {
        const formData = { email, password }
        this.http
            .post<any>(`${this.globalService.apiUrl}/login`, formData, {
                withCredentials: true,
            })
            .subscribe({
                next: (response) => {
                    this.isAuthenticatedSubject = true
                    this.router.navigate(['/dashboard'])
                    return true
                },
                error: (error) => {
                    this.isAuthenticatedSubject = false
                    return false
                },
            })
    }

    isAuthenticated(): boolean {
        console.log('AuthService: Checking authentication status')
        console.log(
            'AuthService: User is ' +
                (this.isAuthenticatedSubject
                    ? 'authenticated'
                    : 'not authenticated')
        )
        return this.isAuthenticatedSubject
    }
}
