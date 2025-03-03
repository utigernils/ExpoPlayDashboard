import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SidebarComponent } from '../../shared/sidebar/sidebar.component'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { HttpClientModule } from '@angular/common/http'
import { HttpClient } from '@angular/common/http'
import { MatIconButton } from '@angular/material/button'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'

// Importiere deinen Dialog
import { AddUserDialogComponent } from './add-user-dialog.component'
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu'
import { EditUserDialogComponent } from './edit-user-dialog.component'

// Beispiel-Interface, an dein tatsächliches User-Modell anpassen
export interface User {
    id: number
    firstName: string
    lastName: string
    email: string
    isAdmin: boolean
}

@Component({
    selector: 'app-user',
    standalone: true,
    imports: [
        SidebarComponent,
        MatCardModule,
        CommonModule,
        MatIconModule,
        HttpClientModule,
        MatCardModule,
        MatIconButton,
        MatDialogModule,
        MatMenu,
        MatMenuTrigger,
        MatMenuItem,
    ],
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
    users: User[] = []

    constructor(
        private http: HttpClient,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.getAllUsers()
    }

    getAllUsers(): void {
        this.http
            .post(
                'http://localhost/expoplayAPI/login',
                {
                    email: 'utigernils@gmail.com',
                    password: 'demo',
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    withCredentials: true,
                }
            )
            .subscribe({
                next: (postResponse) => {
                    console.log('POST response:', postResponse)
                    this.http
                        .get<User[]>('http://localhost/expoplayAPI/user/', {
                            withCredentials: true,
                        })
                        .subscribe({
                            next: (response) => {
                                this.users = response
                                console.log('Users loaded:', this.users)
                            },
                            error: (error) => {
                                console.error(
                                    'Fehler beim Laden der User:',
                                    error
                                )
                            },
                        })
                },
                error: (error) => {
                    console.error('Fehler beim POST-Request:', error)
                },
            })
    }

    openAddUserDialog(): void {
        const dialogRef = this.dialog.open(AddUserDialogComponent, {
            width: '400px', // Optional: Dialogbreite festlegen
        })

        // Ergebnis abfangen, nachdem der Dialog geschlossen wurde
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                // result enthält das newUser-Objekt aus dem Dialog
                this.registerUser(result)
            }
        })
    }

    registerUser(userData: {
        firstName: string
        lastName: string
        email: string
        password: string
        isAdmin: boolean
    }): void {
        const body = {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: userData.password,
            isAdmin: userData.isAdmin,
        }

        this.http
            .post('http://localhost/expoplayAPI/user', body, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            })
            .subscribe({
                next: (response) => {
                    console.log('Neuer User erfolgreich erstellt:', response)
                    // Optional: Liste aller User neu laden
                    this.getAllUsers()
                },
                error: (error) => {
                    console.error('Fehler beim Erstellen des Users:', error)
                },
            })
    }

    trackByUser(index: number, user: User): number {
        return user.id
    }

    deleteUser(user: User): void {
        if (!confirm('Wollen Sie diesen Benutzer wirklich löschen?')) {
            return
        }

        this.http
            .delete(`http://localhost/expoplayAPI/user/${user.id}`, {
                withCredentials: true,
            })
            .subscribe({
                next: (response) => {
                    console.log('Benutzer gelöscht:', response)
                    // Aktualisiere die Benutzerliste, z.B. durch erneutes Laden
                    this.getAllUsers()
                },
                error: (error) => {
                    console.error('Fehler beim Löschen des Benutzers:', error)
                },
            })
    }
    updateUser(user: User): void {
        const body = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isAdmin: user.isAdmin,
        }

        this.http
            .put(`http://localhost/expoplayAPI/user/${user.id}`, body, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            })
            .subscribe({
                next: (response) => {
                    console.log('Benutzer aktualisiert:', response)
                    this.getAllUsers()
                },
                error: (error) => {
                    console.error(
                        'Fehler beim Aktualisieren des Benutzers:',
                        error
                    )
                },
            })
    }

    openEditUserDialog(user: User): void {
        const dialogRef = this.dialog.open(EditUserDialogComponent, {
            width: '400px',
            data: user, // Übergibt die bestehenden Nutzerdaten
        })

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                // Ruft updateUser mit den aktualisierten Daten auf
                this.updateUser(result)
            }
        })
    }
}
