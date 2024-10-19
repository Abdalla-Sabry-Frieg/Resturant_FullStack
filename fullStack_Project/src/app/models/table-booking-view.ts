export interface TableBookingView {
  id: number;
  bookingDate: Date;
  firstName: string;
  phoneNumber: string;
  totalPrice: number;
  branchName: string;
  numberOfGuests: number;
  meals: string[];  // List of meal names
}
