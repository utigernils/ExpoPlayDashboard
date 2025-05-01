import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { SidebarComponent } from '../../shared/sidebar/sidebar.component'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { HttpClientModule, HttpClient } from '@angular/common/http'
import { MatIconButton } from '@angular/material/button'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'

import { AddUserDialogComponent } from './add-user-dialog.component'
import { EditUserDialogComponent } from './edit-user-dialog.component'
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu'
import { GlobalService } from '../../services/global.service' // <-- GlobalService importiert

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
        private dialog: MatDialog,
        public globalService: GlobalService // <-- GlobalService injiziert
    ) {}

    ngOnInit(): void {
        this.getAllUsers()
    }

    getAllUsers(): void {
        this.http
            .get<User[]>(`${this.globalService.apiUrl}/user`, {
                withCredentials: true,
            })
            .subscribe({
                next: () => {
                    this.http
                        .get<User[]>(`${this.globalService.apiUrl}/user/`, {
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
                    console.error('Fehler beim Login:', error)
                },
            })
    }

    openAddUserDialog(): void {
        const dialogRef = this.dialog.open(AddUserDialogComponent, {
            width: '400px',
        })

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
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
            .post(`${this.globalService.apiUrl}/user`, body, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            })
            .subscribe({
                next: (response) => {
                    console.log('Neuer User erfolgreich erstellt:', response)
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
        if (!confirm('Wollen Sie diesen Benutzer wirklich löschen?')) return

        this.http
            .delete(`${this.globalService.apiUrl}/user/${user.id}`, {
                withCredentials: true,
            })
            .subscribe({
                next: (response) => {
                    console.log('Benutzer gelöscht:', response)
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
            .put(`${this.globalService.apiUrl}/user/${user.id}`, body, {
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
            data: user,
        })

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this.updateUser(result)
            }
        })
    }
}
