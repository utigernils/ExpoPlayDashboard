import { Component, Inject } from '@angular/core'
import {
    MAT_DIALOG_DATA,
    MatDialogRef,
    MatDialogModule,
} from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { FormsModule } from '@angular/forms'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { QuestionSet } from './questions-set.interface'

@Component({
    selector: 'app-add-question-dialog',
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
        <h1 mat-dialog-title>Neue Frage hinzufügen</h1>
        <div mat-dialog-content>
            <mat-form-field appearance="fill" style="width: 100%;">
                <mat-label>Frage</mat-label>
                <input matInput [(ngModel)]="question.Question" />
            </mat-form-field>

            <mat-form-field appearance="fill" style="width: 100%;">
                <mat-label>Antwortmöglichkeiten (als JSON)</mat-label>
                <textarea
                    matInput
                    [(ngModel)]="answerPossibilitiesString"
                ></textarea>
            </mat-form-field>

            <mat-form-field appearance="fill" style="width: 100%;">
                <mat-label>Fragentyp</mat-label>
                <input
                    type="number"
                    matInput
                    [(ngModel)]="question.questionType"
                />
            </mat-form-field>

            <mat-form-field appearance="fill" style="width: 100%;">
                <mat-label>Punktefaktor</mat-label>
                <input
                    type="number"
                    matInput
                    [(ngModel)]="question.pointMultiplier"
                />
            </mat-form-field>

            <div mat-dialog-actions align="end">
                <button mat-button (click)="onNoClick()">Abbrechen</button>
                <button mat-button color="primary" (click)="save()">
                    Speichern
                </button>
            </div>
        </div>
    `,
})
export class AddQuestionDialogComponent {
    question: QuestionSet
    answerPossibilitiesString = '{"A":" ","B":" ","C":" ","D":" "}'

    constructor(
        public dialogRef: MatDialogRef<AddQuestionDialogComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: { quizId: string },
        private http: HttpClient
    ) {
        this.question = {
            id: '',
            quiz: this.data.quizId,
            isActive: true,
            questionType: 0,
            pointMultiplier: 1,
            Question: '',
            answerPossibilities: {},
        }
    }

    onNoClick(): void {
        this.dialogRef.close()
    }

    save(): void {
        try {
            this.question.answerPossibilities = JSON.parse(
                this.answerPossibilitiesString
            )
        } catch (e) {
            alert(
                'Fehler: Das Format der Antwortmöglichkeiten ist kein gültiges JSON!'
            )
            return
        }

        const createData = {
            Question: this.question.Question,
            questionType: this.question.questionType,
            pointMultiplier: this.question.pointMultiplier,
            answerPossibilities: this.question.answerPossibilities,
        }

        this.http
            .post<QuestionSet>(
                `http://localhost/expoplayAPI/question/${this.data.quizId}`,
                createData,
                { withCredentials: true }
            )
            .subscribe({
                next: (response) => {
                    this.dialogRef.close(response)
                },
                error: (error) => {
                    console.error('Fehler beim Erstellen der Frage:', error)
                    alert('Fehler beim Erstellen der Frage!')
                },
            })
    }
}
