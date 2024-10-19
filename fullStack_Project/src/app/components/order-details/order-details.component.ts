import { Component, OnInit } from '@angular/core';
import { Meal } from '../../models/meal.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MealService } from '../../Shared/meal.service';
import { immediateProvider } from 'rxjs/internal/scheduler/immediateProvider';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule , CurrencyPipe],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css'
})
export class OrderDetailsComponent implements OnInit {
  meal: Meal | null = null;  // Initialize with null
  errorMessage: string | null = null;
  currentId : number = 0

  constructor(private route: ActivatedRoute, private mealService: MealService , private router :Router) {}

  ngOnInit(): void {
     const id =  this.route.snapshot.paramMap.get('id')
    this.currentId = Number(id)
      if(this.currentId){
        this.mealService.getMeal(this.currentId).subscribe({
          next:(res)=>{
            this.meal = res;
            console.log("current id = " ,this.currentId);

          },
          error: (error)=>{
            console.log("Error feach meal" , error);

          }
        })
      }
  };


goBack()
{
  return this.router.navigate(['/home']);
}
}
