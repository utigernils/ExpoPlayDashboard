import { Component } from '@angular/core'
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog'
import { MatFormFieldModule } from '@angular/material/form-field'
import { FormsModule } from '@angular/forms'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { Quiz } from '../interfaces/quiz.interface'
import { GlobalService } from '../../../services/global.service'

@Component({
    styleUrls: ['add-quiz-dialog.component.scss'],
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
    templateUrl: 'add-quiz-dialog.component.html',
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
