import { AfterViewInit, Component, ViewChild } from '@angular/core'
import { MatSort, MatSortModule } from '@angular/material/sort'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { SidebarComponent } from '../../shared/sidebar/sidebar.component'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatIconButton } from '@angular/material/button'
import { ExpoPlayer } from '../../types/expo.types'

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
            firstname: 'Lenny',
            lastname: 'Test',
            email: 'lenny.ami@gmail.com',
            active: true,
            score: 1,
        },
        {
            id: 2,
            firstname: 'Tobias',
            lastname: 'Tester',
            email: 'Tobi.flix@gmail.com',
            active: true,
            score: 2,
        },
        {
            id: 4,
            firstname: 'Manuel',
            lastname: 'Tester',
            email: 'maun.testmail@gmail.com',
            active: false,
            score: 3,
        },
    ])

    @ViewChild(MatSort) sort!: MatSort

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort
    }
}
