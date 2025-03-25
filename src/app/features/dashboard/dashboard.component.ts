import { Component, OnInit } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { Chart, registerables } from 'chart.js'
import { SidebarComponent } from '../../shared/sidebar/sidebar.component'
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card'
import { MatIcon } from '@angular/material/icon'

Chart.register(...registerables)

interface User {
    id: string
    firstName: string
    lastName: string
    email: string
    isAdmin: boolean | number
}

interface Expo {
    id: string
    name: string
    location: string
    startsOn: string
    endsOn: string
    isActive: boolean
}

interface ConsoleData {
    id: string
    name: string
    currentExpo: string
    lastActive: string
}

interface QuizStats {
    id: string
    quizName: string
    expoName: string
    startedOn: string
    endedOn: string
    correctAnswers: number
    wrongAnswers: number
}

interface Player {
    id: string
    firstName: string
    lastName: string
    email: string
    isActive: boolean
}

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        HttpClientModule,
        SidebarComponent,
        MatCardTitle,
        MatCardContent,
        MatCard,
        MatIcon,
    ],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    users: User[] = []
    expos: Expo[] = []
    quizStats: QuizStats[] = []
    players: Player[] = []
    consoles: ConsoleData[] = []
    totalQuizzesPlayed = 0

    private apiBaseUrl = 'http://localhost/expoplay'
    private authHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
    })

    constructor(private http: HttpClient) {}

    ngOnInit(): void {
        this.getAllUsers()
    }

    getAllUsers(): void {
        this.http
            .post(
                `${this.apiBaseUrl}/login`,
                {
                    email: 'utigernils@gmail.com',
                    password: 'demo',
                },
                {
                    headers: this.authHeaders,
                    withCredentials: true,
                }
            )
            .subscribe({
                next: () => {
                    this.http
                        .get<
                            User[]
                        >(`${this.apiBaseUrl}/user/`, { withCredentials: true })
                        .subscribe({
                            next: (response) => {
                                this.users = response
                                this.loadExpos()
                                this.loadQuizStats()
                                this.loadPlayers()
                                this.loadConsoles()
                            },
                            error: (error) => {
                                console.error(
                                    'Fehler beim Laden der User:',
                                    error
                                )
                            },
                        })
                },
                error: (error) => {
                    console.error('Fehler beim POST-Request:', error)
                },
            })
    }

    loadExpos(): void {
        this.http
            .get<Expo[]>(`${this.apiBaseUrl}/expo`, { withCredentials: true })
            .subscribe({
                next: (data) => {
                    this.expos = data
                },
                error: (err) =>
                    console.error('Fehler beim Laden der Expos:', err),
            })
    }

    loadQuizStats(): void {
        this.http
            .get<
                QuizStats[]
            >(`${this.apiBaseUrl}/played-quiz`, { withCredentials: true })
            .subscribe({
                next: (data) => {
                    this.quizStats = data
                    this.totalQuizzesPlayed = data.length
                },
                error: (err) =>
                    console.error(
                        'Fehler beim Laden der Quiz-Statistiken:',
                        err
                    ),
            })
    }

    loadPlayers(): void {
        this.http
            .get<
                Player[]
            >(`${this.apiBaseUrl}/player`, { withCredentials: true })
            .subscribe({
                next: (data) => {
                    this.players = data
                },
                error: (err) =>
                    console.error('Fehler beim Laden der Spieler:', err),
            })
    }

    loadConsoles(): void {
        this.http
            .get<
                ConsoleData[]
            >(`${this.apiBaseUrl}/console`, { withCredentials: true })
            .subscribe({
                next: (data) => {
                    this.consoles = data
                },
                error: (err) =>
                    console.error('Fehler beim Laden der Konsolen:', err),
            })
    }

    trackByUser(index: number, user: any): string {
        return user.id // Falls die User-Daten eine ID haben, sonst eine andere eindeutige Eigenschaft nehmen
    }
}
