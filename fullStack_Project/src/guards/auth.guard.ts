import { Injectable } from '@angular/core';
import { CanActivate, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../app/Shared/auth.service';


@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService , private router: Router) {}

  canActivate(): boolean {
    if (!this.authService.getToken()) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;

}

  // Method to check if the user has a specific role
  hasRole(role: string): boolean {
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');
    return roles.includes(role);
  }
}
