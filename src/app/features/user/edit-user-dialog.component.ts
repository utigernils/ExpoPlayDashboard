import { Component, Inject } from '@angular/core'
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
import { MAT_DIALOG_DATA } from '@angular/material/dialog'
import { User } from './user.component'

@Component({
    selector: 'app-edit-user-dialog',
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
            Benutzer bearbeiten
        </h2>

        <mat-dialog-content style="padding: 16px;">
            <mat-form-field appearance="fill" style="width: 100%;">
                <mat-label>Vorname</mat-label>
                <input matInput [(ngModel)]="user.firstName" />
            </mat-form-field>

            <mat-form-field appearance="fill" style="width: 100%;">
                <mat-label>Nachname</mat-label>
                <input matInput [(ngModel)]="user.lastName" />
            </mat-form-field>

            <mat-form-field appearance="fill" style="width: 100%;">
                <mat-label>Email</mat-label>
                <input matInput [(ngModel)]="user.email" />
            </mat-form-field>

            <mat-checkbox [(ngModel)]="user.isAdmin" style="margin-top: 8px;"
                >Admin</mat-checkbox
            >
        </mat-dialog-content>

        <mat-dialog-actions align="end" style="padding: 16px;">
            <button mat-button (click)="cancel()">Abbrechen</button>
            <button mat-button color="primary" (click)="save()">
                Speichern
            </button>
        </mat-dialog-actions>
    `,
})
export class EditUserDialogComponent {
    user: User

    constructor(
        public dialogRef: MatDialogRef<EditUserDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: User
    ) {
        this.user = { ...data }
    }

    cancel(): void {
        this.dialogRef.close()
    }

    save(): void {
        this.dialogRef.close(this.user)
    }
}
