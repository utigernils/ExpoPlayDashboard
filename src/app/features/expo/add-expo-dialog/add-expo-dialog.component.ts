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
    styleUrls: ['add-expo-dialog.component.scss'],
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
    templateUrl: 'add-expo-dialog.component.html',
})
export class AddExpoDialogComponent {
    name = ''
    location = ''
    startsOn = ''
    endsOn = ''
    isActive = false

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
