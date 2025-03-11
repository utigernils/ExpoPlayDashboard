import { AfterViewInit, Component, ViewChild } from '@angular/core'
import { SidebarComponent } from '../../shared/sidebar/sidebar.component'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatIconButton } from '@angular/material/button'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { MatSort, MatSortModule } from '@angular/material/sort'
import { Console } from '../../types/console.types'

@Component({
    selector: 'app-console',
    standalone: true,
    imports: [
        SidebarComponent,
        MatCardModule,
        MatIconModule,
        MatIconButton,
        MatTableModule,
        MatSortModule,
    ],
    templateUrl: './console.component.html',
    styleUrls: ['./console.component.scss'],
})
export class ConsoleComponent implements AfterViewInit {
    displayedColumns: string[] = ['consoleName', 'austellung', 'quiz', 'active']

    dataSource = new MatTableDataSource<Console>([
        {
            name: 'Konsole 1',
            exhibition: 'Luzern Zebi',
            quiz: '1',
            active: false,
        },
        {
            name: 'Konsole 2',
            exhibition: 'Luzern Zebi',
            quiz: '1',
            active: true,
        },
    ])

    @ViewChild(MatSort) sort!: MatSort

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort
    }
}
