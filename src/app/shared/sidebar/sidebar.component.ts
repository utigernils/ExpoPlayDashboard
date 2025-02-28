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

@Component({
    selector: 'app-sidebar',
    standalone: true,
    templateUrl: './sidebar.component.html',
    imports: [LucideAngularModule],
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
