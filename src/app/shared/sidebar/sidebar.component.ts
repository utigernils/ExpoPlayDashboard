import { Component } from '@angular/core'
import {
    Camera,
    LucideAngularModule,
    House,
    FileQuestion,
    Factory,
    User,
    FileUser,
} from 'lucide-angular'
import { RouterOutlet } from '@angular/router'

@Component({
    selector: 'app-sidebar',
    standalone: true,
    templateUrl: './sidebar.component.html',
    imports: [LucideAngularModule, RouterOutlet],
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
