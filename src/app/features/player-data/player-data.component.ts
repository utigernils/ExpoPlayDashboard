import { Component, ViewChild, AfterViewInit } from '@angular/core'
import { MatSort, MatSortModule } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { SidebarComponent } from '../../shared/sidebar/sidebar.component'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatIconButton } from '@angular/material/button'
import { MatTableModule } from '@angular/material/table'

@Component({
    selector: 'app-player-data',
    standalone: true,
    imports: [
        SidebarComponent,
        MatCardModule,
        MatIconModule,
        MatIconButton,
        MatTableModule,
        MatSortModule,
    ],
    templateUrl: './player-data.component.html',
    styleUrls: ['./player-data.component.scss'],
})
export class PlayerDataComponent implements AfterViewInit {
    displayedColumns: string[] = [
        'id',
        'vorname',
        'nachname',
        'email',
        'acitve',
        'score',
    ]

    dataSource = new MatTableDataSource<ExpoPlayer>([
        {
            id: 1,
            vorname: 'Lenny',
            nachname: 'Test',
            email: 'lenny.ami@gmail.com',
            acitve: true,
            score: 1,
        },
        {
            id: 2,
            vorname: 'Tobias',
            nachname: 'Tester',
            email: 'Tobi.flix@gmail.com',
            acitve: true,
            score: 2,
        },
        {
            id: 4,
            vorname: 'Manuel',
            nachname: 'Tester',
            email: 'maun.testmail@gmail.com',
            acitve: false,
            score: 3,
        },
    ])

    @ViewChild(MatSort) sort!: MatSort

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort
    }
}

export interface ExpoPlayer {
    id: number
    vorname: string
    nachname: string
    email: string
    acitve: boolean
    score: number
}
