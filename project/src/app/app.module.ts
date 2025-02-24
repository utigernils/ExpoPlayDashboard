import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { routes } from './app-routing.module';

@NgModule({
    declarations: [


        // Weitere Komponenten hier hinzufügen
    ],
    imports: [
        BrowserModule,
        DashboardComponent,
        AppComponent,
        routes
    ],
})
export class AppModule { }
