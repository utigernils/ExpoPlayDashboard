import { Component } from '@angular/core'
import { SidebarComponent } from '../../shared/sidebar/sidebar.component'
import { MatCardModule } from '@angular/material/card'
import { MatIcon } from '@angular/material/icon'
import { MatIconButton } from '@angular/material/button'
import { MatHeaderCell, MatTableModule } from '@angular/material/table'
import { NgClass } from '@angular/common'

@Component({
    selector: 'app-expo',
    standalone: true,
    imports: [
        SidebarComponent,
        MatCardModule,
        MatIcon,
        MatIconButton,
        MatHeaderCell,
        MatTableModule,
        NgClass,
    ],
    templateUrl: './expo.component.html',
    styleUrl: './expo.component.scss',
})
export class ExpoComponent {
    displayedColumns: string[] = ['ausstellung', 'status', 'datum']

    dataSource: Expo[] = [
        {
            ausstellung: 'ZEBI-Luzern',
            status: 'Bereit',
            statusClass: 'status-bereit',
            datum: '10 Apr 2021',
        },
        {
            ausstellung: 'EXPO-Bern',
            status: 'Deaktiviert',
            statusClass: 'status-deaktiviert',
            datum: '18 Apr 2021',
        },
    ]
}

interface Expo {
    ausstellung: string
    status: string
    statusClass: string
    datum: string
}
