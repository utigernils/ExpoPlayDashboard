import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core'
import { SidebarComponent } from '../../shared/sidebar/sidebar.component'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatIconButton } from '@angular/material/button'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { MatSort, MatSortModule } from '@angular/material/sort'
import { HttpClientModule, HttpClient } from '@angular/common/http'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { AddConsoleDialogComponent } from './add-console-dialog.component'
import {
    EditConsoleDialogComponent,
    ConsoleData,
} from './edit-console-dialog.component'

import { ShowConsoleIdDialogComponent } from './ShowConsoleIdDialogComponent'
import { GlobalService } from '../../services/global.service'
import { HeaderComponent } from '../../shared/header/header.component'

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
        HttpClientModule,
        MatDialogModule,
        HeaderComponent,
    ],
    templateUrl: './console.component.html',
    styleUrls: ['./console.component.scss'],
})
export class ConsoleComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = [
        'name',
        'currentExpo',
        'currentQuiz',
        'isActive',
        'actions',
    ]

    dataSource = new MatTableDataSource<Consoles>([])

    @ViewChild(MatSort) sort!: MatSort

    constructor(
        private http: HttpClient,
        private dialog: MatDialog,
        public globalService: GlobalService // <--- im Konstruktor injiziert
    ) {}

    ngOnInit(): void {
        this.getAllConsoles()
    }

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort
    }

    getAllConsoles(): void {
        this.http
            .get<Consoles[]>(`${this.globalService.apiUrl}/console/`, {
                withCredentials: true,
            })
            .subscribe({
                next: (response) => {
                    this.dataSource.data = response
                    console.log('Consoles geladen:', response)
                },
                error: (error) => {
                    console.error('Fehler beim Laden der Consoles:', error)
                },
            })
    }

    openAddConsoleDialog(): void {
        const dialogRef = this.dialog.open(AddConsoleDialogComponent, {
            width: '400px',
        })

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.addConsole(result)
            }
        })
    }

    addConsole(consoleData: Consoles): void {
        this.http
            .post<Consoles>(
                `${this.globalService.apiUrl}/console`,
                consoleData,
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            )
            .subscribe({
                next: (response) => {
                    console.log('Konsole hinzugefügt:', response)
                    this.getAllConsoles()

                    if (response && response.id) {
                        this.dialog.open(ShowConsoleIdDialogComponent, {
                            width: '400px',
                            data: { id: response.id },
                        })
                    } else {
                        console.error(
                            'ID nicht in der Antwort gefunden! Öffne Dialog mit Test-ID.'
                        )
                        this.dialog.open(ShowConsoleIdDialogComponent, {
                            width: '400px',
                            data: { id: 'Test-ID' },
                        })
                    }
                },
                error: (error) => {
                    console.error('Fehler beim Hinzufügen der Konsole:', error)
                },
            })
    }

    openEditConsoleDialog(consoleItem: Consoles): void {
        const dialogRef = this.dialog.open(EditConsoleDialogComponent, {
            width: '400px',
            data: {
                id: consoleItem.id,
                name: consoleItem.name,
                isActive: consoleItem.isActive,
            } as ConsoleData,
        })

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.updateConsole(result)
            }
        })
    }

    updateConsole(consoleData: Consoles): void {
        if (!consoleData.id) {
            console.error('Keine ID vorhanden, Update nicht möglich.')
            return
        }

        const dataWithoutId = {
            name: consoleData.name,
            isActive: consoleData.isActive,
        }

        this.http
            .put(
                `${this.globalService.apiUrl}/console/${consoleData.id}`,
                dataWithoutId,
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            )
            .subscribe({
                next: (response) => {
                    console.log('Konsole aktualisiert:', response)
                    this.getAllConsoles()
                },
                error: (error) => {
                    console.error(
                        'Fehler beim Aktualisieren der Konsole:',
                        error
                    )
                },
            })
    }

    deleteConsole(consoleItem: Consoles): void {
        if (!consoleItem.id) {
            console.error('Keine ID vorhanden, Löschvorgang nicht möglich.')
            return
        }

        if (!confirm('Wollen Sie diese Konsole wirklich löschen?')) {
            return
        }

        this.http
            .delete(`${this.globalService.apiUrl}/console/${consoleItem.id}`, {
                withCredentials: true,
            })
            .subscribe({
                next: (response) => {
                    console.log('Konsole gelöscht:', response)
                    this.getAllConsoles()
                },
                error: (error) => {
                    console.error('Fehler beim Löschen der Konsole:', error)
                },
            })
    }
}

interface Consoles {
    id?: string
    name: string
    isActive: boolean | number
}
