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
    selector: 'app-add-expo-dialog',
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
            Neue Expo hinzufügen
        </h2>

        <!-- Eingabefelder -->
        <mat-dialog-content style="padding: 16px;">
            <mat-form-field appearance="fill" style="width: 100%;">
                <mat-label>Name</mat-label>
                <input matInput [(ngModel)]="name" name="name" />
            </mat-form-field>

            <mat-form-field appearance="fill" style="width: 100%;">
                <mat-label>Location</mat-label>
                <input matInput [(ngModel)]="location" name="location" />
            </mat-form-field>

            <mat-form-field appearance="fill" style="width: 100%;">
                <mat-label>Startdatum</mat-label>
                <input
                    matInput
                    [(ngModel)]="startsOn"
                    name="startsOn"
                    type="date"
                />
            </mat-form-field>

            <mat-form-field appearance="fill" style="width: 100%;">
                <mat-label>Enddatum</mat-label>
                <input
                    matInput
                    [(ngModel)]="endsOn"
                    name="endsOn"
                    type="date"
                />
            </mat-form-field>

            <mat-checkbox
                [(ngModel)]="isActive"
                name="isActive"
                style="margin-top: 8px;"
            >
                Ist aktiv?
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
export class AddExpoDialogComponent {
    // Felder für eine neue Expo – Achte darauf, dass diese Bezeichner genau den Erwartungen deines Backends entsprechen!
    name = ''
    location = ''
    startsOn = ''
    endsOn = ''
    isActive = false // Falls das Backend eine Zahl erwartet, sendest du hier 1 bzw. 0

    constructor(public dialogRef: MatDialogRef<AddExpoDialogComponent>) {}

    cancel(): void {
        this.dialogRef.close()
    }

    save(): void {
        const newExpo = {
            name: this.name,
            location: this.location,
            startsOn: new Date(this.startsOn).toISOString(),
            endsOn: new Date(this.endsOn).toISOString(),
            isActive: this.isActive ? 1 : 0,
        }

        console.log('Neues Expo-Objekt:', newExpo)
        this.dialogRef.close(newExpo)
    }
}
