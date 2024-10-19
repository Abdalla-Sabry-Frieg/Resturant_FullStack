import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TableBookingView } from '../../models/table-booking-view';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { OrderService } from '../../Shared/order.service';
import { TableBooking } from '../../models/table-booking.model';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule , CurrencyPipe],
  templateUrl: './order-confirmation.component.html',
  styleUrl: './order-confirmation.component.css'
})
export class OrderConfirmationComponent implements OnInit{

  booking!: TableBookingView;  // Booking object to store data
  isLoading: boolean = true;   // Show loading state

  constructor(private orderService: OrderService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    const bookingId = this.route.snapshot.params['id'];  // Get ID from route params
    this.getBookingDetails(bookingId);
  }

  // Method to get booking details
  getBookingDetails(id: number): void {
    this.orderService.getBookingById(id).subscribe({
      next: (data) => {
        this.booking = data;
        console.log('Booking details:', this.booking);
        this.isLoading = false;  // Loading done
      },
      error: (error) => {
        console.error('Error fetching booking details:', error);
        this.isLoading = false;
      }
    });
  }
}
