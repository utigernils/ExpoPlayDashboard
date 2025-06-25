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
    styleUrls: ['add-user-dialog.component.scss'],
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
    templateUrl: 'add-user-dialog.component.html',
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
