import { Routes } from '@angular/router';
import { PaymentDetailsComponent } from './components/payment-details/payment-details.component';
import { BranchComponent } from './components/branch/branch.component';
import { HomeComponent } from './components/home/home.component';
import { NotfoundedComponent } from './components/notfounded/notfounded.component';
import { MealComponent } from './components/meal/meal.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from '../guards/auth.guard';
import { UsersComponent } from './components/users/users.component';
import { OrderComponent } from './components/order/order.component';
import { OrdersComponent } from './components/orders/orders.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { OrderConfirmationComponent } from './components/order-confirmation/order-confirmation.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderDetailsComponent } from './components/order-details/order-details.component';

export const routes: Routes = [
  { path: 'payment-details', component: PaymentDetailsComponent },
  { path: 'meals', component: MealComponent , canActivate:[AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'users', component: UsersComponent, canActivate:[AuthGuard] },
  {path:'home' , component:HomeComponent},
  {path:'order' , component:OrderComponent},
  {path : 'orders' , component: OrdersComponent },
  {path:'dashboard' , component:DashboardComponent},
  {path:'orderConfirmation/:id' , component : OrderConfirmationComponent},
  {path:'orderDetails/:id' , component:OrderDetailsComponent},
  {path:'orderList' , component : OrderListComponent},
  { path: 'branches', component: BranchComponent, canActivate:[AuthGuard] },
  { path: '', redirectTo: '/payment-details', pathMatch: 'full' },
  { path: '**', component: NotfoundedComponent } // Wildcard route for 404 page
];
