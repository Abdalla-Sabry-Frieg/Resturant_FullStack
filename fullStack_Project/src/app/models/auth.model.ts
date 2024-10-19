export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string; // Optional
}

export interface LoginDto {
  email: string;
  password: string;
}
