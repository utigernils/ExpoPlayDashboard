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
    styleUrls: ['edit-console-dialog.component.scss'],
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
    templateUrl: 'edit-console-dialog.component.html',
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
