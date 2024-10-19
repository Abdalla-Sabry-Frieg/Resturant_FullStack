import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit, Pipe } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Branch } from '../../models/branch.model';
import { Meal } from '../../models/meal.model';
import { OrderService } from '../../Shared/order.service';
import { TableBooking } from '../../models/table-booking.model';
import { AuthService } from '../../Shared/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MealService } from '../../Shared/meal.service';
import { BookingResponse } from '../../models/booking-response';



@Component({
  selector: 'app-order',
  standalone: true,
  imports: [ReactiveFormsModule , CommonModule  , FormsModule , CurrencyPipe ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit {

  branches: Branch[] = [];      // List of branches
  meals: Meal[] = [];           // List of meals
  orderForm!: FormGroup;        // Form for order inputs
  totalPrice: number = 0;       // Total price of selected meals
  isAdmin : boolean = false ;
  isSubmitting: boolean = false; // Flag to prevent double submission
  filteredMeals: Meal[] = [];
  searchTerm: string = '';

  constructor(private orderService: OrderService , private fb: FormBuilder ,
                private authService : AuthService ,  private router: Router ,
                private mealService : MealService , private route: ActivatedRoute) {}

  ngOnInit(): void {

     // Initialize form controls
     this.orderForm = this.fb.group({
      branchId: ['', Validators.required],
      numberOfGuests: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^01[0-9]{9}$')]], // Assuming this is for Egyptian phone numbers
      selectedMealIds: this.fb.array([], Validators.required)  // Use FormArray for selected meals
    });

    // Load the branches and meals from the server
    this.loadBranches();
   // this.loadMeals();
    // Check if the current user is an Admin
    this.checkAdminRole();

      // Subscribe to query params to get the search term
      this.route.queryParams.subscribe(params => {
        this.searchTerm = params['search'] || '';  // Get the search term from query params
        this.loadMeals();  // Load meals based on the search term
      });

  }

     // Load branches from the API
     loadBranches() {
      this.orderService.getBranches().subscribe((data: Branch[]) => {
        this.branches = data;
      });
    }

    // Load meals from the API
    loadMeals() {
      this.mealService.getMeals(this.searchTerm).subscribe((data: Meal[]) => {
        this.meals = data;
        console.log("meals from order ");
       this.filterMeals();  // Filter meals after loading if a search term exists

      });
    }

    // Filter meals based on the search term
  filterMeals() {
    if (this.searchTerm) {
      this.filteredMeals = this.meals.filter(meal =>
        meal.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.filteredMeals = [...this.meals];  // If no search term, show all meals
    }
  }

  // Helper to access selectedMealIds FormArray
  get selectedMealIdsFormArray(): FormArray {
    return this.orderForm.get('selectedMealIds') as FormArray;
  }

 // Handle meal selection (button click)
 onMealSelectionChange(meal: Meal) {
   // Find the index of the selected meal in the form array
   const index = this.selectedMealIdsFormArray.controls.findIndex(control => control.value === meal.id);

   // If the meal is not selected, add it to the form array (Add to cart)
   if (index === -1) {
     this.selectedMealIdsFormArray.push(this.fb.control(meal.id));
   } else {
     // If the meal is already selected, remove it from the form array (Remove from cart)
     this.selectedMealIdsFormArray.removeAt(index);
   }

  this.updateTotalPrice();  // Update the total price whenever selection changes
}

// Calculate the total price of selected meals
updateTotalPrice() {
   // Map the selected meal IDs to their respective prices and calculate the total
  const selectedMealIds = this.selectedMealIdsFormArray.value;
  this.totalPrice = selectedMealIds
    .map((mealId: number) => this.meals.find(meal => meal.id === mealId)?.price || 0)
    .reduce((sum: number, price: number) => sum + price, 0);
}

// Check if a meal is selected
isMealSelected(mealId: number): boolean {
  return this.selectedMealIdsFormArray.controls.some(control => control.value === mealId);
}

  // Submit the order
  submitOrder() {

    // Prevent double submission by checking if 'isSubmitting' is true
    if (this.isSubmitting) {
      return; // Do nothing if a submission is already in progress
    }

    // Mark form as submitting to prevent further submissions
    this.isSubmitting = true;

    // Ensure at least one meal is selected before submitting
    if (this.selectedMealIdsFormArray.length === 0) {
      console.error('No meals selected. Cannot submit order.');
      return;
    }
// selectedMealIds
    const booking: TableBooking = {
     // id: 0, // Since you are creating a new booking, the id should be 0
      branchId: this.orderForm.value.branchId,
      numberOfGuests: this.orderForm.value.numberOfGuests,
      phoneNumber: this.orderForm.value.phoneNumber,
      selectedMealIds:  this.selectedMealIdsFormArray.value, // Array of selected meal IDs,            // send selected meal IDs
      totalPrice: this.totalPrice,            // Total price of selected meals
      firstName:  localStorage.getItem('userName') ? localStorage.getItem('userName') : null    // This would be filled from user data (could be fetched from API)
    };

    this.orderService.createBooking(booking).subscribe({
      next: (response : BookingResponse) => {
        console.log('Booking submitted successfully:', response);
        console.log("meals list :" , this.selectedMealIdsFormArray.value);
        console.log("is submit : " , this.isSubmitting);
        console.log('Response ID:', response.id);
        console.log('Type of ID:', typeof response.id);
        window.location.reload();
      //  booking.id= response.id;
      // Check if 'id' is available in the response
      if (response.id) {
        // Redirect to the order confirmation page with the booking ID
        this.router.navigate(['/orderConfirmation', response.id]);
      } else {
        console.error('No ID returned from the server', response);
      }
      },
      error : (error) => {
        console.error('Error submitting booking:', error);
        console.error('Error details:', error.error); // Log the detailed error response
        console.log("Selected meal IDs: ",  this.selectedMealIdsFormArray.value);
      }
    });
  }

   // Check if the current user has the Admin role
   checkAdminRole() {
    const decodedToken = this.authService.getDecodedToken();  // Decoded JWT token

    // Extract the role using the proper key
    const roles = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    // Check if the role is 'Admin'
    this.isAdmin = roles === 'Admin';

    console.log("roles: ", roles, "isAdmin: ", this.isAdmin);
  }


  // Navigate to the orders page
  goToOrdersPage() {
    this.router.navigate(['/orders']);  // Replace '/orders' with the actual route for your orders page
  }

   goToOrderDetails(id: number) {

    if ( id> 0) {
      // Navigate to the order details page and pass the selected meal IDs as query params
      this.router.navigate(['/orderDetails' , id]);
    } else {
      console.error('No meals selected to view details.');
    }
  }

}
