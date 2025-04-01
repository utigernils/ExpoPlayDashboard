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
import { Expo } from './expo.component'

@Component({
    selector: 'app-edit-expo-dialog',
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
        <!-- Dialog-Titel -->
        <h2
            mat-dialog-title
            style="background-color: white; color: #ff8200; margin: 0; padding: 16px;"
        >
            Expo bearbeiten
        </h2>

        <!-- Eingabefelder -->
        <mat-dialog-content style="padding: 16px;">
            <mat-form-field appearance="fill" style="width: 100%;">
                <mat-label>Name</mat-label>
                <input matInput [(ngModel)]="expo.name" />
            </mat-form-field>

            <mat-form-field appearance="fill" style="width: 100%;">
                <mat-label>Location</mat-label>
                <input matInput [(ngModel)]="expo.location" />
            </mat-form-field>

            <mat-form-field appearance="fill" style="width: 100%;">
                <mat-label>Beginn</mat-label>
                <input matInput [(ngModel)]="expo.startsOn" type="date" />
            </mat-form-field>

            <mat-form-field appearance="fill" style="width: 100%;">
                <mat-label>Ende</mat-label>
                <input matInput [(ngModel)]="expo.endsOn" type="date" />
            </mat-form-field>

            <!-- Checkbox für isActive -->
            <mat-checkbox [(ngModel)]="expo.isActive" style="margin-top: 8px;">
                Aktiv
            </mat-checkbox>
        </mat-dialog-content>

        <!-- Aktionen -->
        <mat-dialog-actions align="end" style="padding: 16px;">
            <button mat-button (click)="cancel()">Abbrechen</button>
            <button mat-button color="primary" (click)="save()">
                Speichern
            </button>
        </mat-dialog-actions>
    `,
})
export class EditExpoDialogComponent {
    expo: Expo

    constructor(
        public dialogRef: MatDialogRef<EditExpoDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Expo
    ) {
        // Daten clonen, damit nicht direkt das Original bearbeitet wird
        this.expo = { ...data }
    }

    cancel(): void {
        this.dialogRef.close()
    }

    save(): void {
        this.dialogRef.close(this.expo)
    }
}
