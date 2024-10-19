import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaymentDetail } from '../../models/payment-detail.model';
import { PaymentDetailsService } from '../../Shared/payment-details.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-details',
  standalone: true,
  imports: [ReactiveFormsModule , CommonModule],
  templateUrl: './payment-details.component.html',
  styleUrl: './payment-details.component.css'
})
export class PaymentDetailsComponent implements OnInit {

  paymentForm!: FormGroup;
  paymentDetails: PaymentDetail[] = [];
  selectedPaymentDetail!: PaymentDetail | null;


  constructor( private fb: FormBuilder , private paymentDetailService: PaymentDetailsService ){

  }
  ngOnInit(): void {
    this.initForm();
    this.loadPaymentDetails();
  }

  initForm(): void {
    this.paymentForm = this.fb.group({
      cardOwnerName: ['', [Validators.required , Validators.minLength(3) , Validators.maxLength(100)]],
      cardNumber: ['', [Validators.required, Validators.pattern(/^\d{16}$/) , Validators.maxLength(16) ]],
      expirationDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)]],
      securityCode: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]]
    });
  }
  loadPaymentDetails(): void {
    this.paymentDetailService.getPaymentDetails().subscribe((data) => {
      this.paymentDetails = data;
    });
  }

  submitForm(): void {
    if (this.selectedPaymentDetail) {
      this.paymentDetailService.updatePaymentDetail(this.selectedPaymentDetail.paymentDetailId, this.paymentForm.value)
        .subscribe(() => {
          this.loadPaymentDetails();
          this.resetForm();
        });
    } else {
      this.paymentDetailService.createPaymentDetail(this.paymentForm.value)
        .subscribe(() => {
          this.loadPaymentDetails();
          this.resetForm();
        });
    }
  }

  resetForm(): void {
    this.paymentForm.reset();
    this.selectedPaymentDetail = null;
  }
  editPaymentDetail(paymentDetail: PaymentDetail): void {
    this.selectedPaymentDetail = paymentDetail;
    this.paymentForm.patchValue(paymentDetail);
  }

  deletePaymentDetail(id: number): void {
    this.paymentDetailService.deletePaymentDetail(id).subscribe(() => {
      this.loadPaymentDetails();
    });
  }

   // Utility function to check if a form control is invalid and touched
   isFieldInvalid(fieldName: string): any {
    const control = this.paymentForm.get(fieldName);
    return control?.invalid && control?.touched;
  }

 // Get specific validation error for a field
 getFieldError(fieldName: string): string | null {
  const control = this.paymentForm.get(fieldName);

  if (control?.errors) {
    if (control.errors['required']) {
      return 'This field is required.';
    }
    if (control.errors['minlength']) {
      return `Minimum length is ${control.errors['minlength'].requiredLength}.`;
    }
    if (control.errors['maxlength']) {
      return `Maximum length is ${control.errors['maxlength'].requiredLength}.`;
    }
    if (control.errors['pattern']) {
      if (fieldName === 'cardNumber') {
        return 'Card Number must be 16 digits.';
      }
      if (fieldName === 'expirationDate') {
        return 'Expiration Date must be in the format MM/YY.';
      }
      if (fieldName === 'securityCode') {
        return 'Security Code must be 3 digits.';
      }
    }
  }

  return null;
}



}
