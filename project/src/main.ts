import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { provideAnimations } from '@angular/platform-browser/animations';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="sidebar">
      <h2>Expoplay</h2>
      <h3>Dashboard</h3>
      <nav>
        <div class="nav-item">
          <span>Dashboard</span>
        </div>
        <div class="nav-item">
          <span>Quiz Fragen</span>
        </div>
        <div class="nav-item">
          <span>Konsolen Tabelle</span>
        </div>
        <div class="nav-item">
          <span>Expos Tabelle</span>
        </div>
        <div class="nav-item">
          <span>Benutzer Tabelle</span>
        </div>
        <div class="nav-item">
          <span>Spieler Daten</span>
        </div>
      </nav>
    </div>
  `
})
class SidebarComponent {}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="header">
      <div class="breadcrumb">
        Pages / Dashboard
      </div>
      <div class="actions">
        <input type="search" placeholder="Search" />
      </div>
    </div>
  `
})
class HeaderComponent {}

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <h3>Highscore</h3>
      <div class="chart-container">
        <canvas id="highscoreChart"></canvas>
      </div>
    </div>
  `
})
class StatsComponent {}

@Component({
  selector: 'app-consoles',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <h3>Konsole</h3>
      <table class="table">
        <thead>
          <tr>
            <th>NAME</th>
            <th>Austellung</th>
            <th>letzte Aktivität</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Expo-Camera1</td>
            <td>ZEBI-Luzern</td>
            <td>24.Jan.2021</td>
          </tr>
          <tr>
            <td>Expo-Camera2</td>
            <td>ZEBI-Luzern</td>
            <td>12.Jun.2021</td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
class ConsolesComponent {}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SidebarComponent, HeaderComponent, StatsComponent, ConsolesComponent],
  template: `
    <app-sidebar></app-sidebar>
    <div class="main-content">
      <app-header></app-header>
      <app-stats></app-stats>
      <app-consoles></app-consoles>
    </div>
  `
})
export class App {
  name = 'Angular Dashboard';
}

bootstrapApplication(App, {
  providers: [
    provideAnimations()
  ]
}).catch(err => console.error(err));