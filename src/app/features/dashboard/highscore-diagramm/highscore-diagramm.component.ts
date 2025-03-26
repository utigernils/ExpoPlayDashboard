import {
    Component,
    AfterViewInit,
    ElementRef,
    ViewChild,
    Input,
} from '@angular/core'
import { Chart, registerables } from 'chart.js'
import { CommonModule } from '@angular/common'

Chart.register(...registerables)

interface QuizStats {
    id: string
    quizName: string
    expoName: string
    startedOn: string
    endedOn: string
    correctAnswers: number
    wrongAnswers: number
}

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

        const values = this.quizStats.map((stat) => stat.correctAnswers)
        const labels = values.map(() => '')

        if (this.chart) {
            this.chart.destroy()
        }

        this.chart = new Chart(this.chartCanvas.nativeElement, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: '', // keine Legende
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
                        ticks: { display: false },
                        grid: { display: false },
                        title: { display: false },
                    },
                    y: {
                        beginAtZero: true,
                        title: { display: false },
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
