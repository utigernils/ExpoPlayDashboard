import { Component, Inject } from '@angular/core'
import {
    MAT_DIALOG_DATA,
    MatDialogContent,
    MatDialogModule,
    MatDialogRef,
    MatDialogTitle,
} from '@angular/material/dialog'
import { QuestionSet } from './questions-set.interface'
import { MatFormField } from '@angular/material/form-field'
import { FormsModule } from '@angular/forms'
import { MatInputModule } from '@angular/material/input'
import { MatButton } from '@angular/material/button'

@Component({
    selector: 'app-edit-question-dialog',
    standalone: true,
    imports: [
        MatFormField,
        FormsModule,
        MatInputModule,
        MatDialogModule,
        MatButton,
    ],
    template: `
        <h1 mat-dialog-title>Frage bearbeiten</h1>
        <div mat-dialog-content>
            <!-- Eingabefeld für den Fragetext -->
            <mat-form-field appearance="fill" style="width: 100%;">
                <mat-label>Frage</mat-label>
                <input matInput [(ngModel)]="data.question.question" />
            </mat-form-field>

            <!-- Eingabefeld für Antwortmöglichkeiten als JSON-String -->
            <mat-form-field appearance="fill" style="width: 100%;">
                <mat-label>Antwortmöglichkeiten (JSON)</mat-label>
                <textarea
                    matInput
                    rows="6"
                    [(ngModel)]="answerPossibilitiesString"
                ></textarea>
            </mat-form-field>

            <!-- Optional: Typ und Punktefaktor bearbeiten -->
            <mat-form-field appearance="fill" style="width: 100%;">
                <mat-label>Fragentyp</mat-label>
                <input
                    type="number"
                    matInput
                    [(ngModel)]="data.question.questionType"
                />
            </mat-form-field>

            <mat-form-field appearance="fill" style="width: 100%;">
                <mat-label>Punktefaktor</mat-label>
                <input
                    type="number"
                    matInput
                    [(ngModel)]="data.question.pointMultiplier"
                />
            </mat-form-field>
        </div>

        <div mat-dialog-actions align="end">
            <button mat-button (click)="onNoClick()">Abbrechen</button>
            <button mat-button color="primary" (click)="save()">
                Speichern
            </button>
        </div>
    `,
})
export class EditQuestionDialogComponent {
    // Hier speichern wir temporär den JSON-String
    answerPossibilitiesString: string

    constructor(
        public dialogRef: MatDialogRef<EditQuestionDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { question: QuestionSet }
    ) {
        // Wandelt das Objekt (z. B. { A: 'Paris', B: 'Berlin' }) in einen JSON-String um
        this.answerPossibilitiesString = JSON.stringify(
            this.data.question.answerPossibilities,
            null,
            2
        )
    }

    onNoClick(): void {
        this.dialogRef.close()
    }

    save(): void {
        try {
            // Versuchen, den JSON-String zu parsen
            this.data.question.answerPossibilities = JSON.parse(
                this.answerPossibilitiesString
            )
        } catch (e) {
            alert(
                'Fehler: Das Format der Antwortmöglichkeiten ist kein gültiges JSON!'
            )
            return
        }
        // Dialog schließen und die aktualisierte Frage zurückgeben
        this.dialogRef.close(this.data.question)
    }
}
