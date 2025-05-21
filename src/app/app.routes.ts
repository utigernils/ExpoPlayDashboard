import { Routes } from '@angular/router'
import { DashboardComponent } from './features/dashboard/dashboard.component'
import { ConsoleComponent } from './features/console/console.component'
import { QuizQuestionsComponent } from './features/quiz-questions/quiz-questions.component'
import { ExpoComponent } from './features/expo/expo.component'
import { PlayerDataComponent } from './features/player-data/player-data.component'
import { UserComponent } from './features/user/user.component'
import { LoginComponent } from './features/login/login.component'
import { AuthGuard } from './shared/auth.guard'

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'quiz-questions',
        component: QuizQuestionsComponent,
        canActivate: [AuthGuard],
    },
    { path: 'console', component: ConsoleComponent, canActivate: [AuthGuard] },
    { path: 'expo', component: ExpoComponent, canActivate: [AuthGuard] },
    { path: 'user', component: UserComponent, canActivate: [AuthGuard] },
    {
        path: 'player',
        component: PlayerDataComponent,
        canActivate: [AuthGuard],
    },
    { path: 'login', component: LoginComponent },
]
