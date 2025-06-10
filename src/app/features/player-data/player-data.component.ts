import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { MatSort, MatSortModule } from '@angular/material/sort'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatIconButton } from '@angular/material/button'
import { MatCheckbox } from '@angular/material/checkbox'
import { SelectionModel } from '@angular/cdk/collections'
import { forkJoin } from 'rxjs'

import { SidebarComponent } from '../../shared/sidebar/sidebar.component'
import { HeaderComponent } from '../../shared/header/header.component'
import { GlobalService } from '../../services/global.service'
import { EmailAutoService } from '../../services/email-auto.service'

export interface Player {
    id: number
    vorname: string
    nachname: string
    email: string
    active: boolean
}

@Component({
    selector: 'app-player-data',
    standalone: true,
    imports: [
        HttpClientModule,
        SidebarComponent,
        MatCardModule,
        MatIconModule,
        MatIconButton,
        MatTableModule,
        MatSortModule,
        MatCheckbox,
        HeaderComponent,
    ],
    templateUrl: './player-data.component.html',
    styleUrls: ['./player-data.component.scss'],
})
export class PlayerDataComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = [
        'select',
        'vorname',
        'nachname',
        'email',
        'active',
    ]
    dataSource = new MatTableDataSource<Player>([])
    selection = new SelectionModel<Player>(true, [])
    private knownEmails = new Set<string>()

    @ViewChild(MatSort) sort!: MatSort

    constructor(
        private http: HttpClient,
        public globalService: GlobalService,
        private emailAutoService: EmailAutoService
    ) {}

    ngOnInit(): void {
        this.loadPlayers()
    }

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort
    }

    loadPlayers(): void {
        this.http
            .get<Player[]>(`${this.globalService.apiUrl}/player`, {
                withCredentials: true,
            })
            .subscribe({
                next: (players) => {
                    this.dataSource.data = players

                    players.forEach((p) => {
                        const isNew = !this.knownEmails.has(p.email)
                        if (isNew && p.active) {
                            this.emailAutoService.sendEmailTo(p)
                        }
                        this.knownEmails.add(p.email)
                    })
                },
                error: (err) => {
                    console.error('Fehler beim Laden der Spieler:', err)
                },
            })
    }

    isAllSelected(): boolean {
        const numSelected = this.selection.selected.length
        const numRows = this.dataSource.data.length
        return numSelected === numRows
    }

    masterToggle(): void {
        if (this.isAllSelected()) {
            this.selection.clear()
        } else {
            this.dataSource.data.forEach((row) => this.selection.select(row))
        }
    }

    deleteSelected(): void {
        if (
            !confirm('Wollen Sie alle ausgewählten Spieler wirklich löschen?')
        ) {
            return
        }

        const selectedItems = this.selection.selected
        console.log('Ausgewählte Elemente:', selectedItems)

        const deleteRequests = selectedItems.map((player) =>
            this.http.delete(
                `${this.globalService.apiUrl}/player/${player.id}`,
                {
                    withCredentials: true,
                    responseType: 'text',
                }
            )
        )

        forkJoin(deleteRequests).subscribe({
            next: (responses) => {
                console.log(
                    'Alle ausgewählten Spieler wurden gelöscht:',
                    responses
                )
                this.dataSource.data = this.dataSource.data.filter(
                    (row) => !selectedItems.includes(row)
                )
                this.selection.clear()
            },
            error: (error) => {
                console.error('Fehler beim Löschen der Spieler:', error)
            },
        })
    }
}
