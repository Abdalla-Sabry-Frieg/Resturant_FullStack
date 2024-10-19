export interface Meal {
  id: number ;
  name: string;
  price: number ;
  image?: string; // Optional
}

export interface MealDto {
  name: string;
  price: number;
  image?: File | null; // fileform to can the angular can work with it
}
