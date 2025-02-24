import { Component, ViewChild, ElementRef } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  template: `
    <div class="logo">Expoplay</div>
    <nav>
      <a href="#" class="nav-item active">Dashboard</a>
      <a href="#" class="nav-item">Quiz Fragen</a>
      <a href="#" class="nav-item">Konsolen-Tabelle</a>
      <a href="#" class="nav-item">Expos Tabelle</a>
      <a href="#" class="nav-item">Benutzer Tabelle</a>
      <a href="#" class="nav-item">Spieler Daten</a>
    </nav>
  `
})
class SidebarComponent {}

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <div class="header">
      <div class="breadcrumb">Parent / Dashboard</div>
      <div class="user-profile">
        <span>👤</span>
      </div>
    </div>
  `
})
class HeaderComponent {}

@Component({
  selector: 'app-stats',
  standalone: true,
  template: `
    <div class="stats-grid">
      <div class="card">
        <canvas #highscoreChart></canvas>
      </div>
      <div class="card">
        <canvas #quizChart></canvas>
      </div>
      <div class="card">
        <h2 class="card-title">Total gespielte Quizes</h2>
        <div style="font-size: 48px; text-align: center; margin-top: 20px;">49</div>
      </div>
    </div>
  `
})
class StatsComponent {
  @ViewChild('highscoreChart') highscoreChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('quizChart') quizChartRef!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit() {
    this.initHighscoreChart();
    this.initQuizChart();
  }

  initHighscoreChart() {
    const ctx = this.highscoreChartRef.nativeElement.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['15.05.24', '18.05.24', '22.05.24', '28.05.24'],
          datasets: [{
            label: 'Highscore',
            data: [33, 66, 100, 66],
            borderColor: '#ff6b00',
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Highscore'
            }
          }
        }
      });
    }
  }

  initQuizChart() {
    const ctx = this.quizChartRef.nativeElement.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['15.05.24', '18.05.24', '22.05.24'],
          datasets: [{
            label: 'Quizes gespielt',
            data: [10, 20, 30],
            borderColor: '#ff6b00',
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Quizes gespielt'
            }
          }
        }
      });
    }
  }
}

@Component({
  selector: 'app-console-table',
  standalone: true,
  template: `
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Konsole</h2>
      </div>
      <table class="table">
        <thead>
          <tr>
            <th>NAME</th>
            <th>Austellung</th>
            <th>letzte Aktivität</th>
            <th>STATUS</th>
            <th>Konsole-Einsatz</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Expo-Camera1</td>
            <td>ZEBI-Luzern</td>
            <td>24.Jan.2021</td>
            <td><span class="status status-active">Bereit</span></td>
            <td>Konsole 1</td>
          </tr>
          <tr>
            <td>Expo-Camera2</td>
            <td>ZEBI-Luzern</td>
            <td>12.Jun.2021</td>
            <td><span class="status status-inactive">Deaktiviert</span></td>
            <td>Konsole 2</td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
class ConsoleTableComponent {}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SidebarComponent, HeaderComponent, StatsComponent, ConsoleTableComponent],
  template: `
    <div class="dashboard-container">
      <app-sidebar></app-sidebar>
      <main class="main-content">
        <app-header></app-header>
        <app-stats></app-stats>
        <app-console-table></app-console-table>
      </main>
    </div>
  `
})
export class App {}

bootstrapApplication(App);