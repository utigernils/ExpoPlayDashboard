import { Component } from '@angular/core'
import {
    MatDialogActions,
    MatDialogContent,
    MatDialogRef,
    MatDialogTitle,
} from '@angular/material/dialog'
import { FormsModule } from '@angular/forms'
import { CommonModule } from '@angular/common'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'

@Component({
    selector: 'app-add-user-dialog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatInputModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDialogActions,
        MatDialogContent,
        MatDialogTitle,
    ],
    template: `
        <h2
            mat-dialog-title
            style="background-color: white; color: #ff8200; margin: 0; padding: 16px;"
        >
            Neuen Benutzer hinzufügen
        </h2>

        <mat-dialog-content style="padding: 16px;">
            <mat-form-field appearance="fill" style="width: 100%;">
                <mat-label>Vorname</mat-label>
                <input matInput [(ngModel)]="firstName" />
            </mat-form-field>

            <mat-form-field appearance="fill" style="width: 100%;">
                <mat-label>Nachname</mat-label>
                <input matInput [(ngModel)]="lastName" />
            </mat-form-field>

            <mat-form-field appearance="fill" style="width: 100%;">
                <mat-label>Email</mat-label>
                <input matInput [(ngModel)]="email" />
            </mat-form-field>

            <mat-form-field appearance="fill" style="width: 100%;">
                <mat-label>Passwort</mat-label>
                <input matInput [(ngModel)]="password" type="password" />
            </mat-form-field>
        </mat-dialog-content>

        <mat-dialog-actions align="end" style="padding: 16px;">
            <button mat-button (click)="cancel()">Abbrechen</button>
            <button mat-button color="primary" (click)="save()">
                Speichern
            </button>
        </mat-dialog-actions>
    `,
})
export class AddUserDialogComponent {
    firstName = ''
    lastName = ''
    email = ''
    password = ''
    isAdmin = false

    constructor(public dialogRef: MatDialogRef<AddUserDialogComponent>) {}

    cancel(): void {
        this.dialogRef.close()
    }

    save(): void {
        const newUser = {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            password: this.password,
            isAdmin: this.isAdmin ? 1 : 0,
        }
        this.dialogRef.close(newUser)
    }
}
