import { Component, ViewChild, AfterViewInit } from '@angular/core'
import { SidebarComponent } from '../../shared/sidebar/sidebar.component'
import { MatCardModule } from '@angular/material/card'
import { MatIcon } from '@angular/material/icon'
import { MatIconButton } from '@angular/material/button'
import {
    MatHeaderCell,
    MatTableModule,
    MatTableDataSource,
} from '@angular/material/table'
import { NgClass } from '@angular/common'
import { MatSort, MatSortModule } from '@angular/material/sort'

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
        MatSortModule,
    ],
    templateUrl: './expo.component.html',
    styleUrls: ['./expo.component.scss'],
})
export class ExpoComponent implements AfterViewInit {
    displayedColumns: string[] = ['ausstellung', 'status', 'datum']

    dataSource = new MatTableDataSource<Expo>([
        {
            ausstellung: 'ZEBI-Luzern',
            status: 'Bereit',
            datum: '10 Apr 2021',
        },
        {
            ausstellung: 'EXPO-Bern',
            status: 'Deaktiviert',
            datum: '18 Apr 2021',
        },
    ])

    @ViewChild(MatSort) sort!: MatSort

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort
    }
}

interface Expo {
    ausstellung: string
    status: string
    datum: string
}
