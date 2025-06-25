import { Component, Inject } from '@angular/core'
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog'
import { MatButton } from '@angular/material/button'

@Component({
    styleUrls: ['ShowConsoleIdDialogComponent.component.scss'],
    selector: 'app-show-console-id-dialog',
    templateUrl: 'ShowConsoleIdDialogComponent.component.html',
    standalone: true,
    imports: [MatDialogModule, MatButton],
})
export class ShowConsoleIdDialogComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { id: string },
        private dialogRef: MatDialogRef<ShowConsoleIdDialogComponent>
    ) {}

    onClose(): void {
        this.dialogRef.close()
    }
}
