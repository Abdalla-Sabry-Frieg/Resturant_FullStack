import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Branch } from '../models/branch.model';
import { Meal } from '../models/meal.model';
import { TableBooking } from '../models/table-booking.model';
import {BookingResponse} from '../models/booking-response'
import { TableBookingView } from '../models/table-booking-view';
import { AuthService } from './auth.service';
import { OrderCount } from '../models/order-count';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = environment.apiUrl +'/TableBooking'; // Adjust the URL to your backend API

  constructor(private http : HttpClient , private authservice : AuthService) { }

getBranches(): Observable<Branch[]> {
    return this.http.get<Branch[]>(`${this.apiUrl}/branches`);
  }

  getMeals(): Observable<Meal[]> {
    return this.http.get<Meal[]>(`${this.apiUrl}/meals`);
  }

  createBooking(booking: TableBooking): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(`${this.apiUrl}/create-booking`, booking );
  }

  getAllBooking() : Observable<TableBookingView[]>{
    return this.http.get<TableBookingView[]>(`${this.apiUrl}/getAllBooking`);
  }

  deleteBooking(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
 // Method to get a booking by its ID
 getBookingById(id: number): Observable<TableBookingView> {
  return this.http.get<TableBookingView>(`${this.apiUrl}/${id}`);
  }

 // Fetch order count for the logged-in user
 getOrderCount(): Observable<OrderCount> {
  return this.http.get<OrderCount>(`${this.apiUrl}/count`);
}

// Fetch all bookings for the logged-in user
getUserBookings(): Observable<TableBookingView[]> {
  return this.http.get<TableBookingView[]>(`${this.apiUrl}/user-bookings`);
}
}
