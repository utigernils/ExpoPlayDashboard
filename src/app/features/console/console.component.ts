import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core'
import { SidebarComponent } from '../../shared/sidebar/sidebar.component'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatIconButton } from '@angular/material/button'
import { MatTableModule, MatTableDataSource } from '@angular/material/table'
import { MatSort, MatSortModule } from '@angular/material/sort'
import { HttpClientModule, HttpClient } from '@angular/common/http'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { AddConsoleDialogComponent } from './add-console-dialog.component'
import {
    EditConsoleDialogComponent,
    ConsoleData,
} from './edit-console-dialog.component'
import { ShowConsoleIdDialogComponent } from './ShowConsoleIdDialogComponent'

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
    ],
    templateUrl: './console.component.html',
    styleUrls: ['./console.component.scss'],
})
export class ConsoleComponent implements OnInit, AfterViewInit {
    // Definiert die Spalten deiner Tabelle
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
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.getAllConsoles()
    }

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort
    }

    // Lädt alle Konsolen von der API
    getAllConsoles(): void {
        this.http
            .get<Consoles[]>('http://localhost/expoplayAPI/console/', {
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

    // Öffnet den Dialog zum Hinzufügen einer neuen Konsole
    openAddConsoleDialog(): void {
        const dialogRef = this.dialog.open(AddConsoleDialogComponent, {
            width: '400px',
        })

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                // Übergibt die eingegebenen Daten an addConsole()
                this.addConsole(result)
            }
        })
    }

    // Fügt eine neue Konsole hinzu und öffnet danach den Dialog mit der ID
    addConsole(consoleData: Consoles): void {
        this.http
            .post<Consoles>(
                'http://localhost/expoplayAPI/console',
                consoleData,
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            )
            .subscribe({
                next: (response) => {
                    console.log('Konsole hinzugefügt:', response)
                    // Aktualisiere die Liste
                    this.getAllConsoles()

                    // Debug-Ausgabe, um zu prüfen, ob response.id existiert
                    if (response && response.id) {
                        this.dialog.open(ShowConsoleIdDialogComponent, {
                            width: '400px',
                            data: { id: response.id },
                        })
                    } else {
                        console.error(
                            'ID nicht in der Antwort gefunden! Öffne Dialog mit Test-ID.'
                        )
                        // Testweise öffnen wir den Dialog auch ohne echte ID
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

    // Öffnet den Dialog zum Bearbeiten einer bestehenden Konsole
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
                // Übergibt die aktualisierten Daten an updateConsole()
                this.updateConsole(result)
            }
        })
    }

    // Aktualisiert eine bestehende Konsole
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
                `http://localhost/expoplayAPI/console/${consoleData.id}`,
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

    // Löscht eine Konsole
    deleteConsole(consoleItem: Consoles): void {
        if (!consoleItem.id) {
            console.error('Keine ID vorhanden, Löschvorgang nicht möglich.')
            return
        }

        if (!confirm('Wollen Sie diese Konsole wirklich löschen?')) {
            return
        }

        this.http
            .delete(`http://localhost/expoplayAPI/console/${consoleItem.id}`, {
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
    id?: string // oder number, falls deine DB eine Zahl verwendet
    name: string
    isActive: boolean | number
}
