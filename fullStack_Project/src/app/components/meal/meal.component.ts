import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Meal, MealDto } from '../../models/meal.model';
import { MealService } from '../../Shared/meal.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment.development';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-meal',
  standalone: true,
  imports: [ReactiveFormsModule , CommonModule],
  templateUrl: './meal.component.html',
  styleUrl: './meal.component.css'
})
export class MealComponent implements OnInit{

  meals: Meal[] = [];
  selectedMeal?: Meal;
  mealForm: FormGroup;
  mealDto : MealDto = {} as MealDto;
  imagePath : string =""

  selectedFile: File | null = null;  // Holds the selected image file
  previewImage: SafeUrl | null = null;
  environment: any;


  constructor(private mealService: MealService, private fb: FormBuilder , private sanitizer: DomSanitizer) {
    this.mealForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      image: ['']
    });
  }



  ngOnInit(): void {
    this.loadMeals();
  }

  loadMeals(): void {

    this.mealService.getMeals().subscribe((data) => {
      this.meals = data;
    });
  }

  selectMeal(meal: Meal): void {
    this.selectedMeal = meal;
    this.mealForm.patchValue({
      name: meal.name,
      price: meal.price,
      image : meal.image
    });
     // Set preview image
  if (meal.image) {
     this.imagePath = `https://localhost:44314${meal.image}`; // Assuming the image path is correct
   // Ensure correct path for previewing image (Assuming images are served from backend)
   this.previewImage = this.imagePath ?  this.sanitizer.bypassSecurityTrustUrl(`${this.imagePath}`)  : null;
   console.log('Selected meal image:', meal.image);
   console.log('Selected previewImage image:', this.previewImage);

  }
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  createOrUpdateMeal(): void {
    this.mealDto = {
      name: this.mealForm.get('name')?.value,
      price: this.mealForm.get('price')?.value,
      image: this.selectedFile // make sure this is the selected file
    };

    if (this.selectedMeal) {
      this.mealService.updateMeal(this.selectedMeal.id, this.mealDto).subscribe({
        next: () => {
          this.loadMeals();
          this.resetForm();
        },
        error: (err) => console.error('Error updating meal:', err)
      });
    } else {
      this.mealService.createMeal(this.mealDto).subscribe({
        next: () => {
          this.loadMeals();
          this.resetForm();
        },
        error: (err) => console.error('Error creating meal:', err)
      });
    }
  }




  deleteMeal(id: number): void {
    this.mealService.deleteMeal(id).subscribe(() => {
      this.loadMeals();
    });
  }

  resetForm(): void {
    this.selectedMeal = undefined;
    this.mealForm.reset();
    this.selectedFile = null;
    this.previewImage = null;  // Reset image preview

  }

}

