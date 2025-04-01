import { Component } from '@angular/core'
import {
    FormBuilder,
    FormGroup,
    Validators,
    ReactiveFormsModule,
} from '@angular/forms'
import { CommonModule } from '@angular/common'
import { MatButtonModule } from '@angular/material/button'
import { MatInputModule } from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { HeaderComponent } from '../../shared/header/header.component'
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { GlobalService } from '../../services/global.service'

@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.scss'],
    standalone: true,
    imports: [
        HeaderComponent,
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        HttpClientModule,
    ],
})
export class LoginComponent {
    loginForm: FormGroup
    hidePassword = true

    constructor(
        private fb: FormBuilder,
        private globalService: GlobalService,
        private http: HttpClient
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(4)]],
        })
    }

    onSubmit() {
        if (this.loginForm.valid) {
            const formData = this.loginForm.value
            this.http
                .post(`${this.globalService.apiUrl}/login`, formData, {
                    withCredentials: true,
                })
                .subscribe(
                    (response) => {
                        window.location.href = '/dashboard'
                    },
                    (error) => {
                        console.error('Error:', error)
                    }
                )
        }
    }
}
