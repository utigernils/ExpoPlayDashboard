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
    // Diese Spalten beziehen sich auf das Interface 'Consoles'
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
            .get<
                Consoles[]
            >('http://localhost/expoplayAPI/console/', { withCredentials: true })
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
                // result ist ein Objekt vom Typ 'Consoles' oder kompatibel
                this.addConsole(result)
            }
        })
    }

    // Fügt eine neue Konsole hinzu
    addConsole(consoleData: Consoles): void {
        this.http
            .post('http://localhost/expoplayAPI/console', consoleData, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            })
            .subscribe({
                next: (response) => {
                    console.log('Konsole hinzugefügt:', response)
                    this.getAllConsoles()
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
                // Falls dein Backend 'isActive' als boolean oder number erwartet:
                isActive: consoleItem.isActive,
            } as ConsoleData,
        })

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                // result enthält die aktualisierten Daten
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
    name: string // z. B. "Console Alpha"
    isActive: boolean | number // je nach DB (0/1 oder true/false)
}
