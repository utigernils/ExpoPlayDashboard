import { Routes } from '@angular/router';

import { DashboardComponent } from './dashboard/dashboard.component';
import { QuizFragenComponent } from './quiz-fragen/quiz-fragen.component';
import { KonsoleComponent } from './konsole/konsole.component';
import { ExpoComponent } from './expo/expo.component';
import { BenutzerComponent } from './benutzer/benutzer.component';
import { SpielerDatenComponent } from './spieler-daten/spieler-daten.component';

export const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'quiz-fragen', component: QuizFragenComponent },
    { path: 'konsole', component: KonsoleComponent },
    { path: 'expos', component: ExpoComponent },
    { path: 'benutzer', component: BenutzerComponent },
    { path: 'spieler-daten', component: SpielerDatenComponent },
];

