import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Branch } from '../models/branch.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class BranchService {
  url : string = environment.apiUrl + '/Branch';
  constructor(private http : HttpClient , private authService: AuthService) { }

   // Get all branches
  getBranches() : Observable<Branch[]>{
    return this.http.get<Branch[]>(`${this.url}`);
  }

  // Get branch by ID
  getBranch(id : number) : Observable<Branch>{
    return this.http.get<Branch>(`${this.url}/${id}`);
  }

  // Create a new branch
  createBranch(branch : Branch) :Observable<Branch>{
    const headers = this.createAuthorizationHeader();
    return this.http.post<Branch>(`${this.url}`, branch , {headers});
  }

   // Update an existing branch
   updateBranch(id:number , branch : Branch) : Observable<void>{
    const headers = this.createAuthorizationHeader();
    return this.http.put<void>(`${this.url}/${id}` , branch , {headers});
   }

   // Delete a branch
  deleteBranch(id: number): Observable<void> {
    const headers = this.createAuthorizationHeader();
    return this.http.delete<void>(`${this.url}/${id}` , {headers});
  }


  private createAuthorizationHeader() {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,

    });
  }

}
