import {
    Component,
    AfterViewInit,
    ElementRef,
    ViewChild,
    Input,
} from '@angular/core'
import { Chart, registerables } from 'chart.js'
import { QuizStats } from '../../../interfaces/quizstats.interface'

Chart.register(...registerables)

@Component({
    selector: 'app-quizzes-played',
    standalone: true,
    imports: [],
    templateUrl: './quizzes-played.component.html',
    styleUrl: './quizzes-played.component.scss',
})
export class QuizzesPlayedComponent implements AfterViewInit {
    @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>
    @Input() quizStats: QuizStats[] = []
    chart!: Chart

    ngAfterViewInit(): void {
        if (!this.quizStats || this.quizStats.length === 0) {
            console.warn('Keine quizStats vorhanden – kein Diagramm erzeugt.')
            return
        }

        const countByDate: Record<string, number> = {}
        this.quizStats.forEach((stat) => {
            const date = new Date(stat.startedOn).toISOString().split('T')[0] // z.B. "2025-03-26"
            countByDate[date] = (countByDate[date] || 0) + 1
        })

        const sortedDates = Object.keys(countByDate).sort()
        const values = sortedDates.map((date) => countByDate[date])

        if (this.chart) {
            this.chart.destroy()
        }

        this.chart = new Chart(this.chartCanvas.nativeElement, {
            type: 'line',
            data: {
                labels: sortedDates,
                datasets: [
                    {
                        label: '',
                        data: values,
                        tension: 0.4,
                        fill: false,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.4)',
                        pointRadius: 3,
                        pointHoverRadius: 5,
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
                        ticks: {
                            color: '#666',
                            maxRotation: 45,
                            autoSkip: true,
                        },
                        title: {
                            display: true,
                            text: 'Datum',
                        },
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                        },
                        ticks: {
                            stepSize: 1,
                            precision: 0,
                            color: '#666',
                        },
                    },
                },
            },
        })
    }
}
