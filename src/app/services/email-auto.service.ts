import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { GlobalService } from './global.service'
import { Observable, forkJoin } from 'rxjs'

interface Player {
    id: number
    vorname: string
    nachname: string
    email: string
    active: boolean
}

@Injectable({
    providedIn: 'root',
})
export class EmailAutoService {
    constructor(
        private http: HttpClient,
        private globalService: GlobalService
    ) {}

    sendEmailTo(p: Player): void {
        this.http
            .get<
                Player[]
            >(`${this.globalService.apiUrl}/players`, { withCredentials: true })
            .subscribe({
                next: (players: Player[]) => {
                    const activePlayers = players.filter((p) => p.active)

                    const emailRequests: Observable<any>[] = activePlayers.map(
                        (player) => {
                            const emailPayload = {
                                subject: `👋 Hallo ${player.vorname}!`,
                                body: `
                Liebe*r ${player.vorname} ${player.nachname},

                Hier ist deine automatische Nachricht.

                ✉️ Du kannst diesen Text frei anpassen.

                Viele Grüsse
                Dein Team
              `,
                                to: player.email,
                            }

                            return this.http.post(
                                `${this.globalService.apiUrl}/newsletter/send`,
                                emailPayload,
                                {
                                    withCredentials: true,
                                }
                            )
                        }
                    )

                    forkJoin(emailRequests).subscribe({
                        next: () =>
                            console.log('Alle E-Mails erfolgreich gesendet.'),
                        error: (err) =>
                            console.error('Fehler beim E-Mail-Versand:', err),
                    })
                },
                error: (err) =>
                    console.error('Fehler beim Laden der Spieler:', err),
            })
    }
}
