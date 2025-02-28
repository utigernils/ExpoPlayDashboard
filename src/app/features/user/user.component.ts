import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SidebarComponent } from '../../shared/sidebar/sidebar.component'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatIconButton } from '@angular/material/button'

export interface User {
    id: number
    name: string
}

@Component({
    selector: 'app-user',
    standalone: true,
    imports: [
        SidebarComponent,
        MatCardModule,
        CommonModule,
        MatIconModule,
        MatIconButton,
    ],
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
})
export class UserComponent {
    users: User[] = [
        { id: 1, name: 'Nico Marcuard' },
        { id: 2, name: 'Nils Utiger' },
        { id: 3, name: 'Steven Mattmann' },
    ]

    trackByUser(index: number, user: User): number {
        return user.id
    }
}
