import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef } from '@angular/material/dialog'
import { ReactiveFormsModule } from '@angular/forms'
import { MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatButtonModule } from '@angular/material/button'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'app-add-console-dialog',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatCheckboxModule,
        MatButtonModule,
    ],
    template: `
        <!-- Dialog-Titel mit Hintergrundfarbe #ff8200 -->
        <h2
            mat-dialog-title
            style="background-color: white; color: #ff8200; margin: 0; padding: 16px;"
        >
            Neue Konsole hinzufügen
        </h2>

        <!-- Eingabefelder -->
        <mat-dialog-content style="padding: 16px;">
            <form [formGroup]="addConsoleForm">
                <mat-form-field appearance="fill" style="width: 100%;">
                    <mat-label>Konsolen Name</mat-label>
                    <input matInput formControlName="name" required />
                    <mat-error
                        *ngIf="addConsoleForm.get('name')?.hasError('required')"
                    >
                        Konsolen Name ist erforderlich
                    </mat-error>
                </mat-form-field>

                <mat-checkbox formControlName="active">Aktiv</mat-checkbox>
            </form>
        </mat-dialog-content>

        <!-- Aktionen -->
        <mat-dialog-actions align="end" style="padding: 16px;">
            <button mat-button (click)="onCancel()">Abbrechen</button>
            <button
                mat-button
                color="primary"
                (click)="onSubmit()"
                [disabled]="addConsoleForm.invalid"
            >
                Speichern
            </button>
        </mat-dialog-actions>
    `,
})
export class AddConsoleDialogComponent {
    addConsoleForm: FormGroup

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<AddConsoleDialogComponent>
    ) {
        this.addConsoleForm = this.fb.group({
            name: ['', Validators.required],
            active: [false, Validators.required],
        })
    }

    onCancel(): void {
        this.dialogRef.close()
    }

    onSubmit(): void {
        if (this.addConsoleForm.valid) {
            this.dialogRef.close(this.addConsoleForm.value)
        }
    }
}
