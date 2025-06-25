import { Component, Inject } from '@angular/core'
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog'
import { QuestionSet } from '../interfaces/questions-set.interface'
import { MatFormFieldModule } from '@angular/material/form-field'
import { FormsModule } from '@angular/forms'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatSelectModule } from '@angular/material/select'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatRadioModule } from '@angular/material/radio'
import { CommonModule } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { GlobalService } from '../../../services/global.service'

@Component({
    styleUrls: ['edit-question-dialog.component.scss'],
    selector: 'app-edit-question-dialog',
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
    ],
    templateUrl: 'edit-question-dialog.component.html',
})
export class EditQuestionDialogComponent {
    selectedQuestionType = 0

    answerOptions: { Text: string; isCorrect: boolean; points: number }[] = [
        { Text: '', isCorrect: false, points: 0 },
    ]

    trueFalseAnswer = true

    gradingRange: { top: number; bottom: number; points: number }[] = []

    imageOptions: { img_url: string; isCorrect: boolean; points: number }[] = []

    constructor(
        public dialogRef: MatDialogRef<EditQuestionDialogComponent>,
        private http: HttpClient,
        public globalService: GlobalService,
        @Inject(MAT_DIALOG_DATA)
        public data: { question: QuestionSet; quizId: string }
    ) {
        this.selectedQuestionType = data.question.questionType || 0
        this.onQuestionTypeChange()
    }

    onNoClick(): void {
        this.dialogRef.close()
    }

    onQuestionTypeChange(): void {
        this.data.question.questionType = this.selectedQuestionType
        this.setDefaultAnswerOptions()
    }

    setDefaultAnswerOptions(): void {
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
        switch (this.selectedQuestionType) {
            case 0:
                this.data.question.answerPossibilities = {
                    AnswerOptions: this.answerOptions,
                }
                break
            case 1:
                this.data.question.answerPossibilities = {
                    Answer: this.trueFalseAnswer,
                }
                break
            case 2:
                this.data.question.answerPossibilities = {
                    GradingRange: this.gradingRange,
                }
                break
            case 3:
                this.data.question.answerPossibilities = {
                    AnswerOptions: this.imageOptions,
                }
                break
        }

        // JSON-Ausgabe zur Kontrolle
        console.log(
            'Antwortmöglichkeiten (JSON):',
            JSON.stringify(this.data.question.answerPossibilities, null, 2)
        )

        this.dialogRef.close(this.data.question)

        this.data.question.answerPossibilities = JSON.stringify(
            this.data.question.answerPossibilities,
            null,
            2
        )

        this.http
            .put(
                `${this.globalService.apiUrl}/question/${this.data.quizId}/${this.data.question.id}`,
                this.data.question,
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            )
            .subscribe({
                next: (response) => {
                    console.log('Frage aktualisiert:', response)
                },
                error: (error) => {
                    console.error('Fehler beim Aktualisieren der Frage:', error)
                },
            })
    }
}
