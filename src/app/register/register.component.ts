import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { RegisterRequest } from '../models/auth.models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzCardModule,
    NzIconModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  passwordVisible = false;
  private authService = inject(AuthService);
  private message = inject(NzMessageService);
  private router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const data: RegisterRequest = {
        name: this.registerForm.value.name.trim(),
        email: this.registerForm.value.email.trim(),
        password: this.registerForm.value.password
      };
      
      this.authService.register(data).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.message.success('Cadastro realizado');
          // TODO: Redirecionar para página de produtos
        },
        error: (error) => {
          this.isLoading = false;
          const errorMessage = error.error?.message || 'Erro ao realizar cadastro. Tente novamente.';
          this.message.error(errorMessage);
        }
      });
    } else {
      Object.values(this.registerForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
