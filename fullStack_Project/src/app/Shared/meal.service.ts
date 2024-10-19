import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Meal, MealDto } from '../models/meal.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MealService {

  private apiUrl = environment.apiUrl +'/Meal'; // Adjust the URL to your backend API
  constructor(private http: HttpClient , private authService: AuthService) { }


  getMeals(searchTerm: string = ''): Observable<Meal[]> {
    const headers = this.createAuthorizationHeader();

    let params = new HttpParams();
    if (searchTerm) {
      params = params.set('search', searchTerm);  // Add query param if searchTerm exists
    }

    return this.http.get<Meal[]>(`${this.apiUrl}`, { headers , params }) // Adjust the endpoint as needed
      .pipe(tap(meals => console.log('Fetched meals:', meals , params))); // Log the fetched meals

  }


  getMeal(id: number): Observable<Meal> {
    return this.http.get<Meal>(`${this.apiUrl}/${id}`);
  }

  getMealsByIds(mealIds: number[]): Observable<Meal[]> {
    return this.http.post<Meal[]>(`${this.apiUrl}/byIds`, mealIds);
  }

  createMeal(mealDto: MealDto): Observable<any> {
    const headers = this.createAuthorizationHeader();
    const formData: FormData = this.createFormData(mealDto);

    return this.http.post(this.apiUrl, formData , {headers});
  }

  updateMeal(id: number, mealDto: MealDto): Observable<void> {
    const headers = this.createAuthorizationHeader();
    const formData: FormData = this.createFormData(mealDto);

    return this.http.put<void>(`${this.apiUrl}/${id}`, formData, { headers });
  }

  deleteMeal(id: number): Observable<void> {
    const headers = this.createAuthorizationHeader();
    return this.http.delete<void>(`${this.apiUrl}/${id}` , {headers});
  }

  private createFormData(mealDto: MealDto): FormData {
    const formData: FormData = new FormData();
    formData.append('name', mealDto.name);
    formData.append('price', mealDto.price.toString());

    if (mealDto.image) {
      formData.append('image', mealDto.image);
    }

    return formData;
  }

  private createAuthorizationHeader() {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
}
