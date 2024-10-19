import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../Shared/order.service';
import { computeMsgId } from '@angular/compiler';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { TableBookingView } from '../../models/table-booking-view';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule , CurrencyPipe , DatePipe],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent implements OnInit {
  bookings: TableBookingView[] = [];  // Store bookings here
  loading: boolean = true;
  errorMessage: string = '';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.fetchBookings();
  }

  fetchBookings() {
    this.orderService.getUserBookings().subscribe({
      next: (response) => {
        this.bookings = response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching bookings:', error);
        this.errorMessage = 'Could not load bookings.';
        this.loading = false;
      }
    });
  }
}
