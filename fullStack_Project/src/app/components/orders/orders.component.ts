import { Component, OnInit, Pipe } from '@angular/core';
import { TableBooking } from '../../models/table-booking.model';
import { OrderService } from '../../Shared/order.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { TableBookingView } from '../../models/table-booking-view';
import { MealService } from '../../Shared/meal.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule  , CurrencyPipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent  implements OnInit{
  bookings: TableBookingView[] = [];  // Array to store bookings

  constructor(private bookingService: OrderService ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  // Method to load all bookings
  loadBookings() {
    this.bookingService.getAllBooking().subscribe({
      next: (data) => {
        this.bookings = data;  // Store the fetched bookings
      },
      error: (err) => {
        console.error('Error loading bookings:', err);
      },
    });
  }

  // Delete a booking
  deleteBooking(id: number): void {
    if (confirm('Are you sure you want to delete this booking?')) {
      this.bookingService.deleteBooking(id).subscribe(() => {
        // Filter out the deleted booking from the list
        this.bookings = this.bookings.filter(booking => booking.id !== id);
       // alert('Booking deleted successfully');
      }, error => {
        console.error('Error deleting booking', error);
        alert('Failed to delete booking');
      });
    }
  }

}
