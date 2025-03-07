// filepath: /src/app/features/login/login.component.ts
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
import { HeaderComponent } from '../../shared/header/header.component'
import { MatIconModule } from '@angular/material/icon'
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
    ],
})
export class LoginComponent {
    loginForm: FormGroup
    hidePassword = true

    constructor(
        private fb: FormBuilder,
        private globalService: GlobalService
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(4)]],
        })
    }

    onSubmit() {
        if (this.loginForm.valid) {
            const formData = this.loginForm.value
            fetch(`${this.globalService.apiUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
                .then((response) => response.json())
                .then((data) => {
                    console.log('Success:', data)
                })
                .catch((error) => {
                    console.error('Error:', error)
                })
        }
    }
}
