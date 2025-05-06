import { Component } from '@angular/core'

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

    logout() {
        //TODO Funktion einbauen für Logout

        return console.log('Logout Button wurde geklickt')
    }
}
