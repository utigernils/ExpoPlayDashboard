import { Routes } from '@angular/router'
import { DashboardComponent } from './features/dashboard/dashboard.component'
import { ConsoleComponent } from './features/console/console.component'
import { QuizQuestionsComponent } from './features/quiz-questions/quiz-questions.component'
import { ExpoComponent } from './features/expo/expo.component'
import { PlayerDataComponent } from './features/player-data/player-data.component'
import { UserComponent } from './features/user/user.component'

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'quiz-questions', component: QuizQuestionsComponent },
    { path: 'console', component: ConsoleComponent },
    { path: 'expo', component: ExpoComponent },
    { path: 'user', component: UserComponent },
    { path: 'player', component: PlayerDataComponent },
]
