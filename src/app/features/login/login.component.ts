import { Component } from '@angular/core'
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms'
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card'
import { MatFormField } from '@angular/material/form-field'
import { MatCheckbox } from '@angular/material/checkbox'
import { MatIcon } from '@angular/material/icon'

@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html',
    standalone: true,
    styleUrls: ['login.component.scss'],
    imports: [
        MatCardTitle,
        MatCard,
        MatCardContent,
        MatFormField,
        ReactiveFormsModule,
        MatCheckbox,
        MatIcon,
    ],
})
export class LoginComponent {
    loginForm: FormGroup
    hidePassword = true

    constructor(private fb: FormBuilder) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            rememberMe: [false],
        })
    }

    onSubmit() {
        if (this.loginForm.valid) {
            console.log('Form Data:', this.loginForm.value)
        }
    }

    togglePasswordVisibility() {
        this.hidePassword = !this.hidePassword
    }
}
