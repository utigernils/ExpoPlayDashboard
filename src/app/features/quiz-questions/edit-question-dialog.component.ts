import { Component, Inject } from '@angular/core'
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog'
import { QuestionSet } from './questions-set.interface'
import { MatFormFieldModule } from '@angular/material/form-field'
import { FormsModule } from '@angular/forms'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { HttpClientModule } from '@angular/common/http'

@Component({
    selector: 'app-edit-question-dialog',
    standalone: true,
    imports: [
        MatFormFieldModule,
        FormsModule,
        MatInputModule,
        MatDialogModule,
        MatButtonModule,
        HttpClientModule,
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

            <!-- Fragentyp und Punktefaktor bearbeiten -->
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
    // JSON-String für die Antwortmöglichkeiten
    answerPossibilitiesString: string

    constructor(
        public dialogRef: MatDialogRef<EditQuestionDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { question: QuestionSet }
    ) {
        // Konvertiere die Antwortmöglichkeiten in einen JSON-String
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
        // Parse the JSON string into the question object
        try {
            this.data.question.answerPossibilities = JSON.parse(
                this.answerPossibilitiesString
            )
        } catch (e) {
            alert(
                'Fehler: Das Format der Antwortmöglichkeiten ist kein gültiges JSON!'
            )
            return
        }

        // Close the dialog and return the updated question data to the parent
        this.dialogRef.close(this.data.question)
    }
}
