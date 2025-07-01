import { Component, Inject } from '@angular/core'
import {
    MAT_DIALOG_DATA,
    MatDialogModule,
    MatDialogRef,
} from '@angular/material/dialog'
import { QuestionSet } from '../../../interfaces/questions-set.interface'
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

    answerOptions: { Text: string; isCorrect: boolean; points: number }[] = []
    trueFalseAnswer = true
    imageOptions: { img_url: string; isCorrect: boolean; points: number }[] = []

    constructor(
        public dialogRef: MatDialogRef<EditQuestionDialogComponent>,
        private http: HttpClient,
        public globalService: GlobalService,
        @Inject(MAT_DIALOG_DATA)
        public data: { question: QuestionSet; quizId: string }
    ) {
        this.selectedQuestionType = data.question.questionType || 0
        this.initializeAnswerPossibilities()
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
        this.imageOptions = []
    }

    initializeAnswerPossibilities(): void {
        const parsed =
            typeof this.data.question.answerPossibilities === 'string'
                ? JSON.parse(this.data.question.answerPossibilities)
                : this.data.question.answerPossibilities || {}

        switch (this.selectedQuestionType) {
            case 0:
                this.answerOptions = parsed.AnswerOptions || [
                    { Text: '', isCorrect: false, points: 0 },
                ]
                break
            case 1:
                this.trueFalseAnswer = parsed.Answer ?? true
                break
            case 3:
                this.imageOptions = parsed.AnswerOptions || [
                    { img_url: '', isCorrect: false, points: 0 },
                ]
                break
        }
    }

    addAnswerOption() {
        this.answerOptions.push({ Text: '', isCorrect: false, points: 0 })
    }

    addImageOption() {
        this.imageOptions.push({ img_url: '', isCorrect: false, points: 0 })
    }

    save(): void {
        switch (this.selectedQuestionType) {
            case 0:
                this.data.question.answerPossibilities = JSON.stringify({
                    AnswerOptions: this.answerOptions,
                })
                break
            case 1:
                this.data.question.answerPossibilities = JSON.stringify({
                    Answer: this.trueFalseAnswer,
                })
                break
            case 3:
                this.data.question.answerPossibilities = JSON.stringify({
                    AnswerOptions: this.imageOptions,
                })
                break
        }

        const { id, quiz, ...payload } = this.data.question

        this.http
            .put(
                `${this.globalService.apiUrl}/question/${quiz}/${id}`,
                payload,
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                    responseType: 'text',
                }
            )
            .subscribe({
                next: (response) => {
                    try {
                        const parsed = JSON.parse(response)
                        console.log('Antwort (parsed):', parsed)
                    } catch (e) {
                        console.warn(
                            'Antwort war kein gültiges JSON:',
                            response
                        )
                    }
                    this.dialogRef.close(true)
                },
                error: (error) => {
                    console.error('Fehler beim Aktualisieren der Frage:', error)
                },
            })
    }
}
