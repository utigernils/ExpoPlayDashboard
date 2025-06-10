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
import { MatSelectModule } from '@angular/material/select'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatRadioModule } from '@angular/material/radio'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { QuestionSet } from './questions-set.interface'
import { GlobalService } from '../../services/global.service'
import { CommonModule } from '@angular/common'

@Component({
    selector: 'app-add-question-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatFormFieldModule,
        FormsModule,
        MatInputModule,
        MatDialogModule,
        MatButtonModule,
        MatSelectModule,
        MatCheckboxModule,
        MatRadioModule,
        HttpClientModule,
    ],
    template: `
        <h1 mat-dialog-title>Frage bearbeiten</h1>
        <div mat-dialog-content>
            <mat-form-field appearance="fill" style="width: 100%;">
                <mat-label>Frage</mat-label>
                <input matInput [(ngModel)]="question.question" />
            </mat-form-field>

            <mat-form-field appearance="fill" style="width: 100%;">
                <mat-label>Fragetyp</mat-label>
                <mat-select
                    [(ngModel)]="question.questionType"
                    (selectionChange)="onQuestionTypeChange()"
                >
                    <mat-option [value]="0">4 Antwortmöglichkeiten</mat-option>
                    <mat-option [value]="1">Ja / Nein</mat-option>
                    <mat-option [value]="2">Slider</mat-option>
                    <mat-option [value]="3">Bilder</mat-option>
                </mat-select>
            </mat-form-field>

            <!-- Antwortmöglichkeiten -->
            <div *ngIf="question.questionType === 0">
                <h3>Antwortmöglichkeiten</h3>
                <div *ngFor="let option of answerOptions; let i = index">
                    <mat-form-field appearance="fill" style="width: 70%;">
                        <mat-label>Antwort {{ i + 1 }}</mat-label>
                        <input matInput [(ngModel)]="option.Text" />
                    </mat-form-field>
                    <mat-checkbox [(ngModel)]="option.isCorrect"
                        >Richtig?</mat-checkbox
                    >
                    <mat-form-field style="width: 100px;">
                        <mat-label>Punkte</mat-label>
                        <input
                            type="number"
                            matInput
                            [(ngModel)]="option.points"
                        />
                    </mat-form-field>
                </div>
                <button mat-button (click)="addAnswerOption()">
                    Option hinzufügen
                </button>
            </div>

            <!-- Ja / Nein -->
            <div *ngIf="question.questionType === 1">
                <mat-label>Richtige Antwort:</mat-label>
                <mat-radio-group [(ngModel)]="trueFalseAnswer">
                    <mat-radio-button [value]="true">Ja</mat-radio-button>
                    <mat-radio-button [value]="false">Nein</mat-radio-button>
                </mat-radio-group>
            </div>

            <!-- Slider -->
            <div *ngIf="question.questionType === 2">
                <h3>Bewertungsbereiche</h3>
                <div *ngFor="let range of gradingRange; let i = index">
                    <mat-form-field appearance="fill">
                        <mat-label>Obergrenze</mat-label>
                        <input type="number" matInput [(ngModel)]="range.top" />
                    </mat-form-field>
                    <mat-form-field appearance="fill">
                        <mat-label>Untergrenze</mat-label>
                        <input
                            type="number"
                            matInput
                            [(ngModel)]="range.bottom"
                        />
                    </mat-form-field>
                    <mat-form-field appearance="fill">
                        <mat-label>Punkte</mat-label>
                        <input
                            type="number"
                            matInput
                            [(ngModel)]="range.points"
                        />
                    </mat-form-field>
                </div>
                <button mat-button (click)="addGradingRange()">
                    Bereich hinzufügen
                </button>
            </div>

            <!-- Bilder -->
            <div *ngIf="question.questionType === 3">
                <h3>Bildoptionen</h3>
                <div *ngFor="let img of imageOptions; let i = index">
                    <mat-form-field style="width: 70%;">
                        <mat-label>Bild-URL</mat-label>
                        <input matInput [(ngModel)]="img.img_url" />
                    </mat-form-field>
                    <mat-checkbox [(ngModel)]="img.isCorrect"
                        >Richtig?</mat-checkbox
                    >
                    <mat-form-field style="width: 100px;">
                        <mat-label>Punkte</mat-label>
                        <input
                            type="number"
                            matInput
                            [(ngModel)]="img.points"
                        />
                    </mat-form-field>
                </div>
                <button mat-button (click)="addImageOption()">
                    Bild hinzufügen
                </button>
            </div>

            <mat-form-field appearance="fill" style="width: 100%;">
                <mat-label>Punktefaktor</mat-label>
                <input
                    type="number"
                    matInput
                    [(ngModel)]="question.pointMultiplier"
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
export class AddQuestionDialogComponent {
    question: QuestionSet

    answerOptions = [{ Text: '', isCorrect: false, points: 0 }]
    trueFalseAnswer = true
    gradingRange: { top: number; bottom: number; points: number }[] = []
    imageOptions: { img_url: string; isCorrect: boolean; points: number }[] = []

    constructor(
        public dialogRef: MatDialogRef<AddQuestionDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { quizId: string },
        private http: HttpClient,
        public globalService: GlobalService
    ) {
        this.question = {
            id: '',
            quiz: data.quizId,
            isActive: true,
            questionType: 0,
            pointMultiplier: 1,
            question: '',
            answerPossibilities: { AnswerOptions: [] },
        }
        this.onQuestionTypeChange()
    }

    onNoClick(): void {
        this.dialogRef.close()
    }

    onQuestionTypeChange(): void {
        this.answerOptions = [{ Text: '', isCorrect: false, points: 0 }]
        this.trueFalseAnswer = true
        this.gradingRange = []
        this.imageOptions = []
    }

    addAnswerOption() {
        this.answerOptions.push({ Text: '', isCorrect: false, points: 0 })
    }

    addGradingRange() {
        this.gradingRange.push({ top: 0, bottom: 0, points: 0 })
    }

    addImageOption() {
        this.imageOptions.push({ img_url: '', isCorrect: false, points: 0 })
    }

    save(): void {
        switch (this.question.questionType) {
            case 0:
                this.question.answerPossibilities = {
                    AnswerOptions: this.answerOptions,
                }
                break
            case 1:
                this.question.answerPossibilities = {
                    Answer: this.trueFalseAnswer,
                }
                break
            case 2:
                this.question.answerPossibilities = {
                    GradingRange: this.gradingRange,
                }
                break
            case 3:
                this.question.answerPossibilities = {
                    AnswerOptions: this.imageOptions,
                }
                break
        }

        const createData = {
            Question: this.question.question,
            questionType: this.question.questionType,
            pointMultiplier: this.question.pointMultiplier,
            answerPossibilities: JSON.stringify(
                this.question.answerPossibilities,
                null,
                2
            ),
        }

        console.log(
            'Antwortmöglichkeiten (JSON):',
            JSON.stringify(createData.answerPossibilities, null, 2)
        )

        this.http
            .post<QuestionSet>(
                `${this.globalService.apiUrl}/question/${this.data.quizId}`,
                createData,
                { withCredentials: true }
            )
            .subscribe({
                next: (response) => this.dialogRef.close(response),
                error: (error) => {
                    console.error('Fehler beim Erstellen der Frage:', error)
                    alert('Fehler beim Erstellen der Frage!')
                },
            })
    }
}
