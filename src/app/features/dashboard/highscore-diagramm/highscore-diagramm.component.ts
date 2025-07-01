import {
    Component,
    AfterViewInit,
    ElementRef,
    ViewChild,
    Input,
} from '@angular/core'
import { Chart, registerables } from 'chart.js'
import { CommonModule } from '@angular/common'
import { QuizStats } from '../../../interfaces/quizstats.interface'

Chart.register(...registerables)

@Component({
    selector: 'app-highscore-diagramm',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './highscore-diagramm.component.html',
    styleUrls: ['./highscore-diagramm.component.scss'],
})
export class HighscoreDiagrammComponent implements AfterViewInit {
    @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>
    @Input() quizStats: QuizStats[] = []
    chart!: Chart

    ngAfterViewInit(): void {
        if (!this.quizStats || this.quizStats.length === 0) {
            console.warn('Keine quizStats vorhanden – kein Diagramm erzeugt.')
            return
        }

        const now = new Date()
        const today = now.toISOString().split('T')[0]

        const hourlyStats: Record<string, number[]> = {}

        for (let hour = 8; hour <= 18; hour++) {
            hourlyStats[hour.toString().padStart(2, '0')] = []
        }

        this.quizStats.forEach((stat) => {
            const startDate = new Date(stat.startedOn)
            const dateStr = startDate.toISOString().split('T')[0]

            if (dateStr === today) {
                const hour = startDate.getHours()
                if (hour >= 8 && hour <= 18) {
                    const hourKey = hour.toString().padStart(2, '0')
                    hourlyStats[hourKey].push(stat.correctAnswers)
                }
            }
        })

        const labels: string[] = []
        const values: number[] = []

        for (let hour = 8; hour <= 18; hour++) {
            const hourKey = hour.toString().padStart(2, '0')
            labels.push(`${hourKey}:00`)
            const answers = hourlyStats[hourKey]
            if (answers.length > 0) {
                const avg =
                    answers.reduce((sum, val) => sum + val, 0) / answers.length
                values.push(parseFloat(avg.toFixed(2)))
            } else {
                values.push(0)
            }
        }

        if (this.chart) {
            this.chart.destroy()
        }

        this.chart = new Chart(this.chartCanvas.nativeElement, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: '',
                        data: values,
                        tension: 0.3,
                        fill: false,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.4)',
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        spanGaps: true,
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    title: { display: false },
                    legend: { display: false },
                    tooltip: { enabled: true },
                },
                scales: {
                    x: {
                        title: { display: true, text: 'Stunde' },
                    },
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Ø Punkte' },
                        ticks: {
                            stepSize: 1,
                            precision: 0,
                        },
                    },
                },
            },
        })
    }
}
