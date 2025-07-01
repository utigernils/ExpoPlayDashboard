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
import { AddExpoDialogComponent } from './add-expo-dialog/add-expo-dialog.component'
import { EditExpoDialogComponent } from './edit-expo-dialog/edit-expo-dialog.component'
import { GlobalService } from '../../services/global.service'
import { HeaderComponent } from '../../shared/header/header.component'
import { Expo } from '../../interfaces/expo.interface'

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
        HeaderComponent,
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

    constructor(
        private http: HttpClient,
        private dialog: MatDialog,
        public globalService: GlobalService // <-- GlobalService verwendet
    ) {}

    ngOnInit(): void {
        this.loadExpo()
    }

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort
    }

    loadExpo(): void {
        this.http
            .get<
                Expo[]
            >(`${this.globalService.apiUrl}/expo`, { withCredentials: true })
            .subscribe({
                next: (expo) => {
                    this.dataSource.data = expo
                },
                error: (err) => {
                    console.error('Fehler beim Laden der Daten:', err)
                },
            })
    }

    openAddExpoDialog(): void {
        const dialogRef = this.dialog.open(AddExpoDialogComponent, {
            width: '500px',
        })

        dialogRef.afterClosed().subscribe((newExpo) => {
            if (newExpo) {
                const body = {
                    name: newExpo.name,
                    location: newExpo.location,
                    startsOn: newExpo.startsOn,
                    endsOn: newExpo.endsOn,
                    isActive: newExpo.isActive ? 1 : 0,
                }

                this.http
                    .post(`${this.globalService.apiUrl}/expo`, body, {
                        withCredentials: true,
                    })
                    .subscribe({
                        next: () => this.loadExpo(),
                        error: (err) =>
                            console.error(
                                'Fehler beim Erstellen einer Expo:',
                                err
                            ),
                    })
            }
        })
    }

    updateExpo(expo: Expo) {
        const body = {
            name: expo.name,
            location: expo.location,
            startsOn: expo.startsOn,
            endsOn: expo.endsOn,
            isActive: expo.isActive ? 1 : 0,
        }

        return this.http.put(
            `${this.globalService.apiUrl}/expo/${expo.id}`,
            body,
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            }
        )
    }

    openEditExpoDialog(expo: Expo): void {
        const dialogRef = this.dialog.open(EditExpoDialogComponent, {
            width: '500px',
            data: expo,
        })

        dialogRef.afterClosed().subscribe((editedExpo: Expo) => {
            if (editedExpo) {
                this.updateExpo(editedExpo).subscribe({
                    next: () => this.loadExpo(),
                    error: (err) =>
                        console.error(
                            'Fehler beim Aktualisieren der Expo:',
                            err
                        ),
                })
            }
        })
    }

    deleteSelected(): void {
        if (
            !confirm('Wollen Sie alle ausgewählten Elemente wirklich löschen?')
        ) {
            return
        }
        const selectedItems = this.selection.selected
        console.log('Ausgewählte Elemente:', selectedItems)

        const deleteRequests = selectedItems.map((expo) => {
            return this.http.delete(
                `${this.globalService.apiUrl}/expo/${expo.id}`,
                {
                    withCredentials: true,
                    responseType: 'text',
                }
            )
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

    isAllSelected(): boolean {
        const numSelected = this.selection.selected.length
        const numRows = this.dataSource.data.length
        return numSelected === numRows
    }

    masterToggle(): void {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        this.isAllSelected()
            ? this.selection.clear()
            : this.dataSource.data.forEach((row) => this.selection.select(row))
    }
}
