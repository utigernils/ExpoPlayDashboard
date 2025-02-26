import { Component } from '@angular/core'
import { SidebarComponent } from '../../shared/sidebar/sidebar.component'

@Component({
    selector: 'app-quiz-questions',
    standalone: true,
    imports: [SidebarComponent],
    templateUrl: './quiz-questions.component.html',
    styleUrl: './quiz-questions.component.scss',
})
export class QuizQuestionsComponent {}
