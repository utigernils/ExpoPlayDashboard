import { Component, Inject } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule } from '@angular/forms'
import { MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatButtonModule } from '@angular/material/button'

/**
 * Passe dieses Interface an das an, was dein Backend wirklich liefert.
 * Z.B. wenn dein Backend Felder wie 'name' und 'isActive' nutzt,
 * nutze das auch hier im Interface.
 */
export interface ConsoleData {
    id?: string
    name: string
    isActive: boolean
}

@Component({
    selector: 'app-edit-console-dialog',
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
        <!-- Titel mit demselben Styling wie bei "AddUserDialogComponent" -->
        <h2
            mat-dialog-title
            style="background-color: white; color: #ff8200; margin: 0; padding: 16px;"
        >
            Konsole bearbeiten
        </h2>

        <mat-dialog-content style="padding: 16px;">
            <form [formGroup]="editConsoleForm">
                <mat-form-field appearance="fill" style="width: 100%;">
                    <mat-label>Konsolen Name</mat-label>
                    <input matInput formControlName="name" />
                    <mat-error
                        *ngIf="
                            editConsoleForm.get('name')?.hasError('required')
                        "
                    >
                        Konsolen Name ist erforderlich
                    </mat-error>
                </mat-form-field>

                <mat-checkbox formControlName="isActive">Aktiv</mat-checkbox>
            </form>
        </mat-dialog-content>

        <mat-dialog-actions align="end" style="padding: 16px;">
            <button mat-button (click)="onCancel()">Abbrechen</button>
            <button
                mat-button
                color="primary"
                (click)="onSubmit()"
                [disabled]="editConsoleForm.invalid"
            >
                Speichern
            </button>
        </mat-dialog-actions>
    `,
})
export class EditConsoleDialogComponent {
    editConsoleForm: FormGroup

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<EditConsoleDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ConsoleData
    ) {
        this.editConsoleForm = this.fb.group({
            id: [data.id],
            name: [data.name, Validators.required],
            isActive: [data.isActive, Validators.required],
        })
    }

    onCancel(): void {
        this.dialogRef.close()
    }

    onSubmit(): void {
        if (this.editConsoleForm.valid) {
            this.dialogRef.close(this.editConsoleForm.value)
        }
    }
}
