import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatTableDataSource, MatTableModule } from '@angular/material/table'
import { MatSort, MatSortModule } from '@angular/material/sort'
import { SelectionModel } from '@angular/cdk/collections'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { CommonModule } from '@angular/common'
import { forkJoin } from 'rxjs'

import { SidebarComponent } from '../../shared/sidebar/sidebar.component'
import { AddExpoDialogComponent } from './add-expo-dialog.component'
import { EditExpoDialogComponent } from './edit-expo-dialog.component'

@Component({
    selector: 'app-expo',
    standalone: true,
    imports: [
        CommonModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatCheckboxModule,
        MatTableModule,
        MatSortModule,
        MatDialogModule,
        SidebarComponent,
    ],
    templateUrl: './expo.component.html',
    styleUrls: ['./expo.component.scss'],
})
export class ExpoComponent implements OnInit, AfterViewInit {
    displayedColumns: string[] = [
        'select',
        'name',
        'location',
        'startsOn',
        'endsOn',
        'isActive',
        'actions',
    ]

    dataSource = new MatTableDataSource<Expo>([])
    selection = new SelectionModel<Expo>(true, [])

    @ViewChild(MatSort) sort!: MatSort

    private baseUrl = 'http://localhost/expoplayAPI/expo'

    constructor(
        private http: HttpClient,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.loadExpo()
    }

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort
    }

    loadExpo(): void {
        this.http
            .get<Expo[]>(`${this.baseUrl}/`, { withCredentials: true })
            .subscribe({
                next: (expo) => {
                    this.dataSource.data = expo
                },
                error: (err) => {
                    console.error('Fehler beim Laden der Daten:', err)
                },
            })
    }

    // Methode zum Hinzufügen einer neuen Expo
    openAddExpoDialog(): void {
        const dialogRef = this.dialog.open(AddExpoDialogComponent, {
            width: '500px',
        })

        dialogRef.afterClosed().subscribe((newExpo) => {
            if (newExpo) {
                // Achtung: Prüfe auch hier, ob isActive ein Boolean oder number sein muss
                const body = {
                    name: newExpo.name,
                    location: newExpo.location,
                    startsOn: newExpo.startsOn,
                    endsOn: newExpo.endsOn,
                    // Falls der Server 1/0 braucht:
                    isActive: newExpo.isActive ? 1 : 0,
                }

                this.http
                    .post(`${this.baseUrl}/`, body, { withCredentials: true })
                    .subscribe({
                        next: () => {
                            this.loadExpo()
                        },
                        error: (err) => {
                            console.error(
                                'Fehler beim Erstellen einer Expo:',
                                err
                            )
                        },
                    })
            }
        })
    }

    // updateExpo gibt jetzt das Observable zurück
    updateExpo(expo: Expo) {
        // Falls der Server dieselben Felder wie beim POST erwartet:
        const body = {
            name: expo.name,
            location: expo.location,
            startsOn: expo.startsOn,
            endsOn: expo.endsOn,
            // Prüfe hier, ob dein Backend 1/0 statt true/false will
            isActive: expo.isActive ? 1 : 0,
        }

        return this.http.put(`${this.baseUrl}/${expo.id}`, body, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        })
    }

    // Öffnet den Dialog zum Bearbeiten
    openEditExpoDialog(expo: Expo): void {
        const dialogRef = this.dialog.open(EditExpoDialogComponent, {
            width: '500px',
            data: expo,
        })

        dialogRef.afterClosed().subscribe((editedExpo: Expo) => {
            if (editedExpo) {
                this.updateExpo(editedExpo).subscribe({
                    next: () => {
                        this.loadExpo()
                    },
                    error: (err) => {
                        console.error(
                            'Fehler beim Aktualisieren der Expo:',
                            err
                        )
                    },
                })
            }
        })
    }

    // Löscht alle ausgewählten Expos
    deleteSelected(): void {
        if (
            !confirm('Wollen Sie alle ausgewählten Elemente wirklich löschen?')
        ) {
            return
        }

        const selectedItems = this.selection.selected
        console.log('Ausgewählte Elemente:', selectedItems)

        const deleteRequests = selectedItems.map((expo) => {
            return this.http.delete(`${this.baseUrl}/${expo.id}`, {
                withCredentials: true,
                responseType: 'text',
            })
        })

        forkJoin(deleteRequests).subscribe({
            next: (responses) => {
                console.log(
                    'Alle ausgewählten Expos wurden gelöscht:',
                    responses
                )
                this.dataSource.data = this.dataSource.data.filter(
                    (row) => !selectedItems.includes(row)
                )
                this.selection.clear()
            },
            error: (error) => {
                console.error('Fehler beim Löschen der Expos:', error)
            },
        })
    }

    // Auswahl-Logik für die Checkboxen
    isAllSelected(): boolean {
        const numSelected = this.selection.selected.length
        const numRows = this.dataSource.data.length
        return numSelected === numRows
    }

    masterToggle(): void {
        this.isAllSelected()
            ? this.selection.clear()
            : this.dataSource.data.forEach((row) => this.selection.select(row))
    }
}

export interface Expo {
    id: number
    name: string
    location: string
    startsOn: string // Prüfe, ob du ein anderes Format brauchst
    endsOn: string // Prüfe, ob du ein anderes Format brauchst
    isActive: any // Falls dein Backend 0/1 erwartet, kannst du hier 'number' oder 'boolean' nutzen
}
