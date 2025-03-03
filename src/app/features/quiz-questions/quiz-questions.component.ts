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
            data: { question: question },
        })

        dialogRef.afterClosed().subscribe((updatedQuestion: QuestionSet) => {
            if (updatedQuestion) {
                // Hier kannst du die geänderte Frage weiterverarbeiten,
                // z. B. in this.questionSets updaten oder an den Server senden.§
            }
        })
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

    parseAnswerPossibilities(possibilities: any): any {
        // Falls es noch ein String ist, versuche ihn zu parsen
        if (typeof possibilities === 'string') {
            try {
                return JSON.parse(possibilities)
            } catch (error) {
                console.error('Konnte answerPossibilities nicht parsen', error)
                return {} // Fallback: leeres Objekt
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
