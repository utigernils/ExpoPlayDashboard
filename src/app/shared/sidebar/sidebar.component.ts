import { Component } from '@angular/core'
import { Router } from '@angular/router'
import { GlobalService } from '../../services/global.service'

import {
    Factory,
    FileQuestion,
    FileUser,
    House,
    LucideAngularModule,
    User,
    Gamepad,
    LogOut,
} from 'lucide-angular'
import { RouterLink, RouterLinkActive } from '@angular/router'
import { HttpClient } from '@angular/common/http'

@Component({
    selector: 'app-sidebar',
    standalone: true,
    templateUrl: './sidebar.component.html',
    imports: [LucideAngularModule, RouterLink, RouterLinkActive],
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    icons = {
        gamepad: Gamepad,
        house: House,
        FileQuestion: FileQuestion,
        factory: Factory,
        user: User,
        FileUser: FileUser,
        logout: LogOut,
    }

    constructor(
        private http: HttpClient,
        private router: Router,
        private globalService: GlobalService
    ) {}

    logout() {
        this.http
            .get(`${this.globalService.apiUrl}/logout`, {
                withCredentials: true,
            })
            .subscribe({
                next: () => {
                    localStorage.clear()
                    sessionStorage.clear()
                    this.router.navigate(['/login'])
                },
                error: (err) => {
                    console.error('Fehler beim Logout:', err)
                },
            })
    }
}
