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
import { QuestionSet } from '../interfaces/questions-set.interface'
import { GlobalService } from '../../../services/global.service'
import { CommonModule } from '@angular/common'

@Component({
    styleUrls: ['add-questions-dialog.component.scss'],
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
    templateUrl: 'add-questions-dialog.component.html',
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
