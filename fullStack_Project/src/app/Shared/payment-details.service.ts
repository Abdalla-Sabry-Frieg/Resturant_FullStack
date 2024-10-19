import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { PaymentDetail } from '../models/payment-detail.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentDetailsService {

  url:string =environment.apiUrl + '/PaymentDetails';

  constructor(private http : HttpClient) { }

   // Get all payment details
   getPaymentDetails(): Observable<PaymentDetail[]> {
    return this.http.get<PaymentDetail[]>(this.url);
  }

  // Get payment detail by ID
  getPaymentDetail(id: number): Observable<PaymentDetail> {
    return this.http.get<PaymentDetail>(`${this.url}/${id}`);
  }

  // Add new payment detail
  createPaymentDetail(paymentDetail: PaymentDetail): Observable<PaymentDetail> {
    return this.http.post<PaymentDetail>(this.url, paymentDetail);
  }

  // Update payment detail
  updatePaymentDetail(id: number, paymentDetail: PaymentDetail): Observable<void> {
    return this.http.put<void>(`${this.url}/${id}`, paymentDetail);
  }

  // Delete payment detail
  deletePaymentDetail(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }

  }


