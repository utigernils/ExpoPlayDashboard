import { Component, Inject } from '@angular/core'
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog'
import { MatButton } from '@angular/material/button'

@Component({
    selector: 'app-show-console-id-dialog',
    template: `
        <h2
            mat-dialog-title
            style="background-color: white; color: #ff8200; margin: 0; padding: 16px;"
        >
            Konsole-ID
        </h2>

        <!-- Inhalt -->
        <mat-dialog-content style="padding: 16px;">
            <p>Deine neu erstellte Konsolen-ID lautet:</p>
            <strong>{{ data.id }}</strong>
            <p style="margin-top: 16px;">
                Du kannst diese ID nur einmal sehen. Wenn du dieses Fenster
                schließt, ist die ID nicht mehr verfügbar.
            </p>
        </mat-dialog-content>

        <!-- Aktionen -->
        <mat-dialog-actions align="end" style="padding: 16px;">
            <button mat-button (click)="onClose()">Schließen</button>
        </mat-dialog-actions>
    `,
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
