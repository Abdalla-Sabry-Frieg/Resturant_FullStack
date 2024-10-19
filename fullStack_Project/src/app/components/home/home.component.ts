import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { OrderComponent } from "../order/order.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, OrderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  // Add this method in your home.component.ts
toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar?.classList.toggle('d-none'); // Toggle visibility
}

}
