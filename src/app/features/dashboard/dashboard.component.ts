import { Component } from '@angular/core'
import {
    MatCardContent,
    MatCardModule,
    MatCardTitle,
} from '@angular/material/card'
import {
    MatCell,
    MatColumnDef,
    MatHeaderCell,
    MatTableModule,
} from '@angular/material/table'
import { MatIconModule } from '@angular/material/icon'
import { SidebarComponent } from '../../shared/sidebar/sidebar.component'

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        MatCardContent,
        MatCardModule,
        MatCardTitle,
        MatTableModule,
        MatIconModule,
        MatCell,
        MatHeaderCell,
        MatColumnDef,
        SidebarComponent,
    ],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {}
