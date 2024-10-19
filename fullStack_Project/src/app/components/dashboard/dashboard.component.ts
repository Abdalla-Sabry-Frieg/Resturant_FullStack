import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Shared/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule , CurrencyPipe ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  totalBookings: number = 0;
  totalMeals: number = 0;
  totalUsers: number = 0;
  totalRevenue: number = 0;
  recentBookings: any[] = [];

  constructor(private adminService: AuthService ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  // Load data for the dashboard
  loadDashboardData() {
    // this.adminService.getDashboardStats().subscribe(data => {
    //   this.totalBookings = data.totalBookings;
    //   this.totalMeals = data.totalMeals;
    //   this.totalUsers = data.totalUsers;
    //   this.totalRevenue = data.totalRevenue;
    // });

    // this.adminService.getRecentBookings().subscribe(bookings => {
    //   this.recentBookings = bookings;
    // });
  }

  // Delete a booking
  deleteBooking(id: number) {
    // if (confirm('Are you sure you want to delete this booking?')) {
    //   this.adminService.deleteBooking(id).subscribe(() => {
    //     this.recentBookings = this.recentBookings.filter(b => b.id !== id);
    //   });
    // }
  }
}
