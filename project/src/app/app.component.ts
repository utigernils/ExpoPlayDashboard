import {Component, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import {QuizFragenComponent} from "./quiz-fragen/quiz-fragen.component";
import {RouterModule, RouterOutlet} from "@angular/router";
import { routes } from './app-routing.module';
import {BrowserModule} from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SidebarComponent, QuizFragenComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

@NgModule({
  declarations: [

  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    AppComponent,
  ],
  providers: [],
})

export class AppComponent {}
