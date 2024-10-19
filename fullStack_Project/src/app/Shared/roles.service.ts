import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private apiUrl =  environment.apiUrl +'/Roles';;

  constructor(private http: HttpClient) { }

   // Get all roles
   getAllRoles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`);
  }

  createRole(name: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, name, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
  }

  updateRole(roleId: string, newRoleName: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, { roleId, newRoleName });
  }

  // Assign a role to a user
  assignRole(email: string, role: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/assign`, { email, role });
  }

  // Remove a role from a user
  removeRole(email: string, role: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/remove-role`, { email, role });
  }

  // Delete a role
  deleteRole(roleName: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${roleName}`);
  }

}
