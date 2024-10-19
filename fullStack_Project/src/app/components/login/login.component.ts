import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoginDto } from '../../models/auth.model';
import { AuthService } from '../../Shared/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule , CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService , private router: Router ,
    private toastr: ToastrService // Inject ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  login(): void {
    if (this.loginForm.valid) {
      const loginDto: LoginDto = this.loginForm.value;
      this.authService.login(loginDto).subscribe({
      next:  (response: any) => {
          this.toastr.success('Login successful!', 'Success');
          console.log(response);
          console.log("login succes");

          localStorage.setItem('token', response.token);  // Save the token
          localStorage.setItem('userName', response.userName); // Store the user's name
          this.router.navigate(['/home']).then(()=>{
            window.location.reload();
          });

          // Store the token if needed and navigate to another page
        },
       error: (error: { error: string; }) => {
          this.toastr.error('Login failed: ' + error.error, 'Error');
          console.error(error);
        }
    });
    }
  }
}
