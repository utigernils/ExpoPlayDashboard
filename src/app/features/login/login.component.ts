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
import { AuthService } from '../../services/auth.service'
import { HttpClient, HttpClientModule } from '@angular/common/http'

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
    providers: [HttpClient],
})
export class LoginComponent {
    loginForm: FormGroup
    hidePassword = true

    constructor(
        private fb: FormBuilder,
        private authService: AuthService
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(4)]],
        })
    }

    onSubmit() {
        if (this.loginForm.valid) {
            const formData = this.loginForm.value
            this.authService.login(formData.email, formData.password)
        }
    }
}
