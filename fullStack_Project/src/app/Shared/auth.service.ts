import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { RegisterDto, LoginDto } from '../models/auth.model';
import { Router } from '@angular/router';
import { user } from '../models/user';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl =  environment.apiUrl +'/Accounts'; // Adjust the URL to your backend API
  private tokenKey = 'token';
 // private roleKey = 'role';
  private isAuthenticated = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient , private router: Router) { }

  register(registerDto: RegisterDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, registerDto);
  }

  login(loginDto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, loginDto);

  }

  logout() {
    return this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
      next: () => {
        // Remove token from localStorage
        localStorage.removeItem(this.tokenKey);
        //localStorage.removeItem(this.roleKey);
        localStorage.removeItem('userName');
        // Navigate to login page or home page after logout
        this.router.navigate(['/login']).then(()=>{
          window.location.reload();
        });
        console.log('user logout succesfully');

      },
      error: (err) => {
        console.error('Logout failed', err);
      }
    });
  }

  // setToken(token: string) {
  //   localStorage.setItem(this.tokenKey, token);
  //   this.isAuthenticated.next(true);
  // }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getTokenBool(): boolean {
    const res = localStorage.getItem(this.tokenKey);
    return res ? true : false

  }

  // setUserRole(roles: string[]) {

  //   localStorage.setItem(this.roleKey, roles.join(','));
  // }

// Method to decode the JWT token and get its payload
getDecodedToken(): any {
  const token = this.getToken();
  if (token) {
    return jwtDecode(token);  // Decode the token
  }
  return null;
}

  getUserRole(): string[] {

    const decodedToken = this.getDecodedToken();
    if (decodedToken && decodedToken.role) {  // Assuming 'role' or 'roles' claim exists in the token
      return Array.isArray(decodedToken.role) ? decodedToken.role : [decodedToken.role];
    }
    return [];

  }

  isLoggedIn() {
    return this.isAuthenticated.asObservable();
  }

  // Check if the user has the required role
  hasRole(role: string): boolean {
    const roles = this.getUserRole();
    return roles.includes(role);
  }

  // getAllUsers(): Observable<any>{
  //   return this.http.get(`${this.apiUrl}/users`);
  // }

  // Method to get users from the API
  getUsers(): Observable<user[]> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get<user[]>(`${this.apiUrl}/users`, { headers });
  }


deleteUser(userId: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/delete/${userId}`);
}

}
