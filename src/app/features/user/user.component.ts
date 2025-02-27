import { Component } from '@angular/core'
import { SidebarComponent } from '../../shared/sidebar/sidebar.component'

@Component({
    selector: 'app-user',
    standalone: true,
    imports: [SidebarComponent],
    templateUrl: './user.component.html',
    styleUrl: './user.component.scss',
})
export class UserComponent {}
