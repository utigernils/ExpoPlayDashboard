import { Component } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { SidebarComponent } from '../../shared/sidebar/sidebar.component'
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card'
import { HighscoreDiagrammComponent } from './highscore-diagramm/highscore-diagramm.component'
import { Chart, registerables } from 'chart.js'
import { QuizzesPlayedComponent } from './quizzes-played/quizzes-played.component'
import { HeaderComponent } from '../../shared/header/header.component'

import { GlobalService } from '../../services/global.service'
import { User } from '../../interfaces/user.interface'
import { Expo } from '../../interfaces/expo.interface'
import { Consoles } from '../../interfaces/console.interface'
import { QuizStats } from '../../interfaces/quizstats.interface'
import { Player } from '../../interfaces/player.interface'

Chart.register(...registerables)

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
        HighscoreDiagrammComponent,
        QuizzesPlayedComponent,
        HeaderComponent,
    ],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
    users: User[] = []
    expos: Expo[] = []
    quizStats: QuizStats[] = []
    players: Player[] = []
    consoles: Consoles[] = []
    totalQuizzesPlayed = 0
    chartReady = false

    globalService = new GlobalService()

    private authHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
    })

    constructor(private http: HttpClient) {
        this.checkAuthentication()
    }

    checkAuthentication(): void {
        this.http
            .get(`${this.globalService.apiUrl}/login`, {
                withCredentials: true,
            })
            .subscribe({
                next: (data: any) => {
                    if (data.state == false) {
                        window.location.href = '/login'
                    }
                    this.loadAllData()
                },
                error: () => {
                    window.location.href = '/login'
                },
            })
    }

    loadAllData(): void {
        this.loadUsers()
        this.loadExpos()
        this.loadQuizStats()
        this.loadPlayers()
        this.loadConsoles()
    }

    loadUsers(): void {
        this.http
            .get<
                User[]
            >(`${this.globalService.apiUrl}/user/`, { withCredentials: true })
            .subscribe({
                next: (response) => {
                    this.users = response
                },
                error: (error) =>
                    console.error('Fehler beim Laden der User:', error),
            })
    }

    loadExpos(): void {
        this.http
            .get<
                Expo[]
            >(`${this.globalService.apiUrl}/expo`, { withCredentials: true })
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
            .get<QuizStats[]>(`${this.globalService.apiUrl}/played-quiz`, {
                withCredentials: true,
            })
            .subscribe({
                next: (data) => {
                    this.quizStats = data
                    this.totalQuizzesPlayed = data.length
                    this.chartReady = true
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
            >(`${this.globalService.apiUrl}/player`, { withCredentials: true })
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
            .get<Consoles[]>(`${this.globalService.apiUrl}/console`, {
                withCredentials: true,
            })
            .subscribe({
                next: (data) => {
                    this.consoles = data
                },
                error: (err) =>
                    console.error('Fehler beim Laden der Konsolen:', err),
            })
    }

    trackByUser(index: number, user: User): string {
        return user.id
    }
}
