import { Component } from '@angular/core'
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { FormsModule } from '@angular/forms'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { Quiz } from './quiz.interface'

@Component({
    selector: 'app-add-quiz-dialog',
    standalone: true,
    imports: [
        MatFormFieldModule,
        FormsModule,
        MatInputModule,
        MatDialogModule,
        MatButtonModule,
        HttpClientModule,
    ],
    template: `
        <h1 mat-dialog-title>Neues Quiz erstellen</h1>
        <div mat-dialog-content>
            <mat-form-field appearance="fill" style="width: 100%;">
                <mat-label>Quiz-Name</mat-label>
                <input matInput [(ngModel)]="quiz.name" />
            </mat-form-field>

            <mat-form-field appearance="fill" style="width: 100%;">
                <mat-label>Aktiv?</mat-label>
                <!-- Einfacher Text-Eingabefeld. Wenn du lieber einen Checkbox möchtest,
             kannst du stattdessen <mat-checkbox [(ngModel)]="quiz.isActive">Aktiv</mat-checkbox> verwenden -->
                <input matInput [(ngModel)]="quiz.isActive" />
            </mat-form-field>
        </div>

        <div mat-dialog-actions align="end">
            <button mat-button (click)="onNoClick()">Abbrechen</button>
            <button mat-button color="primary" (click)="save()">
                Speichern
            </button>
        </div>
    `,
})
export class AddQuizDialogComponent {
    quiz: Quiz = {
        id: '',
        name: '',
        isActive: true,
    }

    constructor(
        public dialogRef: MatDialogRef<AddQuizDialogComponent>,
        private http: HttpClient
    ) {}

    onNoClick(): void {
        this.dialogRef.close()
    }

    save(): void {
        const createData = {
            name: this.quiz.name,
            isActive: this.quiz.isActive,
        }

        this.http
            .post<Quiz>('http://localhost/expoplayAPI/quiz', createData, {
                withCredentials: true,
            })
            .subscribe({
                next: (response) => {
                    // Falls dein Backend z. B. "Name" statt "name" zurückgibt, kannst du es hier angleichen.
                    // Fürs Beispiel nehmen wir an, es kommt korrekt als "name" zurück.
                    const fixedResponse: Quiz = {
                        id: response.id,
                        name: response.name ?? createData.name,
                        isActive: response.isActive ?? createData.isActive,
                    }
                    // Dialog schließen und das neu erstellte Quiz-Objekt zurückgeben
                    this.dialogRef.close(fixedResponse)
                },
                error: (error) => {
                    console.error('Fehler beim Erstellen des Quiz:', error)
                    alert('Fehler beim Erstellen des Quiz!')
                },
            })
    }
}
