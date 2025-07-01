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
import { User } from '../../../interfaces/user.interface'

@Component({
    styleUrls: ['edit-user-dialog.component.scss'],
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
    templateUrl: 'edit-user-dialog.component.html',
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
