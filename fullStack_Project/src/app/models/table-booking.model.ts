
export interface TableBooking {
  id?:number;
  branchId: number;
  numberOfGuests: number;
  phoneNumber: string;
  selectedMealIds: number[];      // List of selected meal IDs
  totalPrice: number;
  firstName: string | null;

}
