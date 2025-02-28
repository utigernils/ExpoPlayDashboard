import { Component } from '@angular/core'
import { SidebarComponent } from '../../shared/sidebar/sidebar.component'
import { MatCardModule } from '@angular/material/card'
import { MatIcon } from '@angular/material/icon'
import { MatIconButton } from '@angular/material/button'

@Component({
    selector: 'app-quiz-questions',
    standalone: true,
    imports: [SidebarComponent, MatCardModule, MatIcon, MatIconButton],
    templateUrl: './quiz-questions.component.html',
    styleUrl: './quiz-questions.component.scss',
})
export class QuizQuestionsComponent {}
