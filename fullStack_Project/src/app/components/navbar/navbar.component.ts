import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../Shared/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrderService } from '../../Shared/order.service';
import { OrderCount } from '../../models/order-count';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink , RouterLinkActive , CommonModule , ReactiveFormsModule , FormsModule ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit , AfterViewChecked{

  userName: string | null = '';
  isLogin : boolean = false;
  searchTerm: string = '';  // Bind this to the input field
  orderCount: number = 0;   // Track the number of orders

  constructor(private authService: AuthService , private changeDetectorRef: ChangeDetectorRef ,
               private router: Router , private orderService : OrderService){}

  ngAfterViewChecked(): void {
   this.changeDetectorRef.detectChanges();
  }

  ngOnInit(): void {
    this.userName = localStorage.getItem('userName'); // Retrieve the username when the component initializes

    if (this.authService.isLoggedIn()) {
      this.getOrderCount();
    }
  }

   // Function to fetch the order count
   getOrderCount() {
    this.orderService.getOrderCount().subscribe({
     next: (response: any) => {
        this.orderCount = response.orderCount;
        console.log("count : " , this.orderCount);

      },
     error: (error) => {
        console.error("Error fetching order count:", error);
      }
   });
  }

// Navigate to order confirmation component
goToOrderConfirmation() {
  this.router.navigate(['/orders']);
}

  isLoggedIn(): boolean {
    const token = this.authService.getTokenBool();
    return token; // If token exists, user is logged in
  }

  onLogout(){
    this.authService.logout();
  }

   // Method to handle search and navigate to the order component with query params
   onSearch() {
      // Navigate to the OrderComponent with the search term as a query parameter
      this.router.navigate(['/home'], { queryParams: { search: this.searchTerm}});
      console.log("the srearch term :" , this.searchTerm);

  }

}
