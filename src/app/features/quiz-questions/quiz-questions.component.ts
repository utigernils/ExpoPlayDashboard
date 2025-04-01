import { Component, OnInit } from '@angular/core'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { CommonModule } from '@angular/common'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { SidebarComponent } from '../../shared/sidebar/sidebar.component'
import { Quiz } from './quiz.interface'
import { QuestionSet } from './questions-set.interface'
import { EditQuestionDialogComponent } from './edit-question-dialog.component'
import { MatDialog } from '@angular/material/dialog'
import { AddQuestionDialogComponent } from './add-questions-dialog.component'
import { AddQuizDialogComponent } from './add-quiz-dialog.component'

@Component({
    selector: 'app-quiz-with-questions',
    standalone: true,
    imports: [
        CommonModule,
        MatExpansionModule,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        SidebarComponent,
        HttpClientModule,
    ],
    templateUrl: './quiz-questions.component.html',
    styleUrls: ['./quiz-questions.component.scss'],
})
export class QuizQuestionsComponent implements OnInit {
    quizzes: Quiz[] = []
    questionSets: QuestionSet[] = []

    constructor(
        private http: HttpClient,
        private dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.loadQuizzes()
    }

    loadQuizzes(): void {
        this.http
            .get<
                Quiz[]
            >('http://localhost/expoplayAPI/quiz', { withCredentials: true })
            .subscribe({
                next: (data) => {
                    this.quizzes = data
                    for (const quiz of data) {
                        this.loadQuestionSetsForQuiz(quiz.id)
                    }
                },
                error: (err) => {
                    console.error('Fehler beim Laden der Quiz:', err)
                },
            })
    }

    loadQuestionSetsForQuiz(quizId: string): void {
        this.http
            .get<
                QuestionSet[]
            >(`http://localhost/expoplayAPI/question/${quizId}`, { withCredentials: true })
            .subscribe({
                next: (data) => {
                    this.questionSets.push(...data)
                },
                error: (err) => {
                    console.error('Fehler beim Laden der Fragen:', err)
                },
            })
    }

    openEditDialog(question: QuestionSet): void {
        const dialogRef = this.dialog.open(EditQuestionDialogComponent, {
            width: '600px',
            data: { question },
        })

        dialogRef.afterClosed().subscribe((updatedQuestion: QuestionSet) => {
            if (updatedQuestion) {
                // Update erfolgt via PUT und anschließend im lokalen Array aktualisieren
                this.updateQuestion(
                    updatedQuestion.quiz,
                    updatedQuestion.id,
                    updatedQuestion
                )
            }
        })
    }

    updateQuestion(
        quizId: string,
        questionId: string,
        updatedData: Partial<QuestionSet>
    ): void {
        const dataToSend = { ...updatedData }
        delete dataToSend.id
        delete dataToSend.quiz

        this.http
            .put(
                `http://localhost/expoplayAPI/question/${quizId}/${questionId}`,
                dataToSend,
                { withCredentials: true }
            )
            .subscribe({
                next: () => {
                    this.updateLocalQuestion(updatedData)
                },
                error: (err) => {
                    console.error('Fehler beim Updaten:', err)
                },
            })
    }

    private updateLocalQuestion(updatedData: Partial<QuestionSet>): void {
        if (!updatedData.id) return

        const index = this.questionSets.findIndex(
            (q) => q.id === updatedData.id
        )
        if (index !== -1) {
            this.questionSets[index] = {
                ...this.questionSets[index],
                ...updatedData,
            }
        }
    }

    confirmDeleteQuestion(question: QuestionSet): void {
        const isSure = confirm('Möchten Sie diese Frage wirklich löschen?')
        if (!isSure) return
        this.deleteQuestion(question)
    }

    deleteQuestion(question: QuestionSet): void {
        const quizId = question.quiz
        const questionId = question.id

        this.http
            .delete(
                `http://localhost/expoplayAPI/question/${quizId}/${questionId}`,
                { withCredentials: true }
            )
            .subscribe({
                next: () => {
                    this.removeLocalQuestion(questionId)
                },
                error: (err) => {
                    console.error('Fehler beim Löschen:', err)
                },
            })
    }

    openAddQuestionDialog(quizId: string): void {
        const dialogRef = this.dialog.open(AddQuestionDialogComponent, {
            data: { quizId },
        })

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                // Falls im zurückgegebenen Datensatz die Quiz-ID fehlt, setzen wir sie
                result.quiz = result.quiz || quizId
                // Erzeuge eine neue Array-Referenz, um Angulars Change Detection zu triggern
                this.questionSets = [...this.questionSets, result]
            }
        })
    }

    openAddQuizDialog(): void {
        const dialogRef = this.dialog.open(AddQuizDialogComponent, {
            width: '600px',
        })

        dialogRef.afterClosed().subscribe((newQuiz: Quiz) => {
            if (newQuiz) {
                // Füge das neu erstellte Quiz in dein lokales Array ein
                this.quizzes = [...this.quizzes, newQuiz]
            }
        })
    }

    private removeLocalQuestion(questionId: string | number): void {
        this.questionSets = this.questionSets.filter((q) => q.id !== questionId)
    }

    parseAnswerPossibilities(possibilities: any): any {
        if (!possibilities) return {}
        if (typeof possibilities === 'string') {
            try {
                return JSON.parse(possibilities)
            } catch (error) {
                console.error(
                    'Fehler beim Parsen von answerPossibilities:',
                    error
                )
                return {}
            }
        }
        return possibilities
    }

    objectKeys<T extends object>(obj: T | null | undefined): (keyof T)[] {
        try {
            return obj ? (Object.keys(obj) as (keyof T)[]) : []
        } catch (error) {
            console.error('Fehler in objectKeys():', error)
            return []
        }
    }

    getQuestionsForQuiz(quizId: string): QuestionSet[] {
        return this.questionSets.filter((q) => q.quiz === quizId)
    }

    confirmDeleteQuiz(quiz: Quiz): void {
        const isSure = confirm('Möchten Sie dieses Quiz wirklich löschen?')
        if (!isSure) return
        this.deleteQuiz(quiz)
    }

    deleteQuiz(quiz: Quiz): void {
        const quizId = quiz.id

        this.http
            .delete(`http://localhost/expoplayAPI/quiz/${quizId}`, {
                withCredentials: true,
            })
            .subscribe({
                next: () => {
                    this.removeLocalQuiz(quizId)
                },
                error: (err) => {
                    console.error('Fehler beim Löschen des Quiz:', err)
                },
            })
    }

    private removeLocalQuiz(quizId: string): void {
        this.quizzes = this.quizzes.filter((q) => q.id !== quizId)
    }
}
