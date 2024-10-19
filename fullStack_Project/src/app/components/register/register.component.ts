import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegisterDto } from '../../models/auth.model';
import { AuthService } from '../../Shared/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule , CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['']
    });
  }

  register(): void {
    if (this.registerForm.valid) {
      const registerDto: RegisterDto = this.registerForm.value;
      this.authService.register(registerDto).subscribe(
        (response: any) => {
          alert('Registration successful!');
          console.log(response);
          this.registerForm.reset;
          // Optionally navigate to login or home page
        },
        (error: { error: string[]; }) => {
          alert('Registration failed: ' + error.error[0]);
          console.error(error);
        }
      );
    }
  }
}
