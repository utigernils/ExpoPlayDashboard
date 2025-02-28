import { Component, ViewChild, AfterViewInit } from '@angular/core'
import { SidebarComponent } from '../../shared/sidebar/sidebar.component'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatIconButton } from '@angular/material/button'
import { MatTableModule, MatTableDataSource } from '@angular/material/table'
import { MatSort, MatSortModule } from '@angular/material/sort'

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

    dataSource = new MatTableDataSource<Consoles>([
        {
            consoleName: 'Konsole 1',
            austellung: 'Luzern Zebi',
            quiz: '1',
            active: false,
        },
        {
            consoleName: 'Konsole 2',
            austellung: 'Luzern Zebi',
            quiz: '1',
            active: true,
        },
    ])

    @ViewChild(MatSort) sort!: MatSort

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort
    }
}

interface Consoles {
    consoleName: string
    austellung: string
    quiz: string
    active: boolean
}
