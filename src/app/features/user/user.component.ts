import { Component } from '@angular/core'
import { SidebarComponent } from '../../shared/sidebar/sidebar.component'
import { MatCardModule } from '@angular/material/card'

@Component({
    selector: 'app-user',
    standalone: true,
    imports: [SidebarComponent, MatCardModule],
    templateUrl: './user.component.html',
    styleUrl: './user.component.scss',
})
export class UserComponent {}
