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
    styleUrls: ['add-console-dialog.component.scss'],
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
    templateUrl: 'add-console-dialog.component.html',
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
            const newId = '123456'
            this.dialogRef.close({
                ...this.addConsoleForm.value,
                id: newId,
            })
        }
    }
}
