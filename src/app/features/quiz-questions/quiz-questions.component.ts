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

    openEditDialog(question: QuestionSet): void {
        const dialogRef = this.dialog.open(EditQuestionDialogComponent, {
            width: '600px',
            data: { question },
        })

        dialogRef.afterClosed().subscribe((updatedQuestion: QuestionSet) => {
            if (updatedQuestion) {
                const quizId = updatedQuestion.quiz // Falls quiz als String kommt
                const questionId = updatedQuestion.id
                this.updateQuestion(quizId, questionId, updatedQuestion)
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
                next: (response) => {
                    console.log('Update erfolgreich:', response)
                    this.updateLocalQuestion(updatedData)
                },
                error: (err) => {
                    console.error('Fehler beim Updaten:', err)
                },
            })
    }

    private updateLocalQuestion(updatedData: Partial<QuestionSet>): void {
        if (!updatedData.id) {
            return
        }
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

    ngOnInit(): void {
        // 1) Quizzes laden
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

                    // 2) Für jedes Quiz separat die Fragen laden
                    for (const quiz of data) {
                        this.loadQuestionSetsForQuiz(quiz.id)
                    }
                },
                error: (err) => {
                    console.error('Fehler beim Laden der Quiz:', err)
                },
            })
    }

    loadQuestionSetsForQuiz(quizId: number): void {
        // Hier wird der quizId-Parameter an die URL angehängt
        this.http
            .get<QuestionSet[]>(
                `http://localhost/expoplayAPI/question/${quizId}`,
                {
                    withCredentials: true,
                }
            )
            .subscribe({
                next: (data) => {
                    // 3) Eingehende Fragen ins gemeinsame Array pushen
                    this.questionSets.push(...data)
                },
                error: (err) => {
                    console.error('Fehler beim Laden der Fragen:', err)
                },
            })
    }

    confirmDeleteQuestion(question: QuestionSet): void {
        const isSure = confirm('Möchten Sie diese Frage wirklich löschen?')
        if (!isSure) {
            return
        }
        this.deleteQuestion(question)
    }

    deleteQuestion(question: QuestionSet): void {
        // Hier gehen wir davon aus, dass question.quiz und question.id
        // existieren und die nötigen IDs enthalten.
        const quizId = question.quiz
        const questionId = question.id

        this.http
            .delete(
                `http://localhost/expoplayAPI/question/${quizId}/${questionId}`,
                {
                    withCredentials: true,
                }
            )
            .subscribe({
                next: (response) => {
                    console.log('Löschung erfolgreich:', response)
                    // Entferne die Frage lokal aus dem questionSets-Array,
                    // damit das UI aktualisiert wird.
                    this.removeLocalQuestion(questionId)
                },
                error: (err) => {
                    console.error('Fehler beim Löschen:', err)
                },
            })
    }

    openAddQuestionDialog(quizId: string): void {
        // Öffne den Dialog und übergebe (optional) die quizId
        const dialogRef = this.dialog.open(AddQuestionDialogComponent, {
            data: { quizId: quizId },
        })

        // Behandle das Ergebnis nach dem Schließen des Dialogs
        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log('Neue Frage wurde erstellt:', result)
                // Hier kannst du z. B. eine Liste von Fragen neu laden oder aktualisieren
            }
        })
    }

    private removeLocalQuestion(questionId: string | number): void {
        this.questionSets = this.questionSets.filter((q) => q.id !== questionId)
    }

    parseAnswerPossibilities(possibilities: any): any {
        // Wenn possibilities null oder undefined ist, liefere einfach ein leeres Objekt
        if (!possibilities) {
            return {}
        }

        // Falls es ein String ist, versuchen zu parsen
        if (typeof possibilities === 'string') {
            try {
                return JSON.parse(possibilities)
            } catch (error) {
                console.error('Konnte answerPossibilities nicht parsen', error)
                return {}
            }
        }

        // Ansonsten direkt zurückgeben
        return possibilities
    }

    /**
     * Filtert alle geladenen Fragen anhand der quizId
     */
    getQuestionsForQuiz(quizId: number): QuestionSet[] {
        // Weil questionSet.quiz oft ein String ist, quizId aber eine Zahl:
        return this.questionSets.filter((q) => q.quiz === quizId.toString())
    }

    /**
     * Erlaubt das Iterieren über die Keys eines Objekts (z. B. answerPossibilities)
     */
    objectKeys<T extends object>(obj: T): (keyof T)[] {
        return Object.keys(obj) as (keyof T)[]
    }
}
