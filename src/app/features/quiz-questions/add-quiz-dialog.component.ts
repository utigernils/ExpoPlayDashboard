import { Component } from '@angular/core'
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { FormsModule } from '@angular/forms'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { Quiz } from './quiz.interface'
import { GlobalService } from '../../services/global.service'

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
        private http: HttpClient,
        public globalService: GlobalService
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
            .post<Quiz>(this.globalService.apiUrl, createData, {
                withCredentials: true,
            })
            .subscribe({
                next: (response) => {
                    const fixedResponse: Quiz = {
                        id: response.id,
                        name: response.name ?? createData.name,
                        isActive: response.isActive ?? createData.isActive,
                    }

                    this.dialogRef.close(fixedResponse)
                },
                error: (error) => {
                    console.error('Fehler beim Erstellen des Quiz:', error)
                    alert('Fehler beim Erstellen des Quiz!')
                },
            })
    }
}
