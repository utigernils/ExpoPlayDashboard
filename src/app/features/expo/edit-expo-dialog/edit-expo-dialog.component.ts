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
import { Expo } from '../../../interfaces/expo.interface'

@Component({
    styleUrls: ['edit-expo-dialog.component.scss'],
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
    templateUrl: 'edit-expo-dialog.component.html',
})
export class EditExpoDialogComponent {
    expo: Expo

    constructor(
        public dialogRef: MatDialogRef<EditExpoDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: Expo
    ) {
        this.expo = { ...data }
    }

    cancel(): void {
        this.dialogRef.close()
    }

    save(): void {
        this.dialogRef.close(this.expo)
    }
}
