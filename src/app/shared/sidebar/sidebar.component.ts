import { Component } from '@angular/core'
import {
    Camera,
    Factory,
    FileQuestion,
    FileUser,
    House,
    LucideAngularModule,
    User,
} from 'lucide-angular'
import { RouterLinkActive, RouterOutlet } from '@angular/router'

@Component({
    selector: 'app-sidebar',
    standalone: true,
    templateUrl: './sidebar.component.html',
    imports: [LucideAngularModule, RouterOutlet, RouterLinkActive],
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
    icons = {
        camera: Camera,
        house: House,
        FileQuestion: FileQuestion,
        factory: Factory,
        user: User,
        FileUser: FileUser,
    }
}
