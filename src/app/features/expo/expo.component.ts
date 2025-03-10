import { AfterViewInit, Component, ViewChild } from '@angular/core'
import { SidebarComponent } from '../../shared/sidebar/sidebar.component'
import { MatCardModule } from '@angular/material/card'
import { MatIcon } from '@angular/material/icon'
import { MatIconButton } from '@angular/material/button'
import {
    MatHeaderCell,
    MatTableDataSource,
    MatTableModule,
} from '@angular/material/table'
import { NgClass } from '@angular/common'
import { MatSort, MatSortModule } from '@angular/material/sort'
import { Expo } from '../../types/expo.types'

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
    @ViewChild(MatSort) sort!: MatSort
    displayedColumns: string[] = ['ausstellung', 'status', 'datum']
    dataSource = new MatTableDataSource<Expo>([
        {
            exhibition: 'ZEBI-Luzern',
            status: 'Bereit',
            date: new Date('2021-04-12T08:00:00'),
        },
        {
            exhibition: 'EXPO-Bern',
            status: 'Deaktiviert',
            date: new Date('2021-04-18T08:00:00'),
        },
    ])

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort
    }
}
