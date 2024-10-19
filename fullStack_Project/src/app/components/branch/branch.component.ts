import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { Branch } from '../../models/branch.model';
import { BranchService } from '../../Shared/branch.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-branch',
  standalone: true,
  imports: [CommonModule , ReactiveFormsModule ],
  templateUrl: './branch.component.html',
  styleUrl: './branch.component.css'
})
export class BranchComponent implements OnInit {


  form: FormGroup;
  branches: Branch[] = [];
  selectedBranch?: Branch;


  constructor(private branchService: BranchService , private fb : FormBuilder ){
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],

    });
  }

  ngOnInit(): void {
       this.loadBranches();
  }

   // Load all branches
   loadBranches(): void {
    this.branchService.getBranches().subscribe((data) => {
      this.branches = data;
      console.log(data);

    });
  }

  // Create a new branch
  createBranch(): void {
    console.log('Form Submitted');
    if (this.form.valid) {
      console.log('Form is valid, submitting branch data:', this.form.value);
      const newBranch = new Branch(this.form.value.name);
      this.branchService.createBranch(newBranch).subscribe(
        (response) => {
          console.log('Branch created successfully:', response);
          this.loadBranches(); // Reload branches after successful creation
          this.form.reset();
        },
        (error) => {
          console.error('Error creating branch:', error);
        }
      );
    } else {
      console.error('Form is invalid');
    }
  }

  // Edit a branch
  editBranch(branch: Branch): void {
    this.selectedBranch = branch;
    this.form.patchValue({
    //  id:branch.id,
      name: branch.name,
    });
  }

  // Update an existing branch
updateBranch(): void {
  if (this.selectedBranch && this.form.valid) {
    // Make sure the selectedBranch object has an ID before proceeding
    if (!this.selectedBranch.id) {
      console.error('Branch ID is missing.');
      return;
    }

    // Prepare updated branch data
    const updatedBranch = {
      id: this.selectedBranch.id,  // Ensure the ID is passed
      name: this.form.value.name
    };

    // Call the service to update the branch
    this.branchService.updateBranch(this.selectedBranch.id, updatedBranch).subscribe({
      next: () => {
        this.loadBranches(); // Reload branches after update
        this.form.reset();
        this.selectedBranch = undefined;
      },
      error: (err) => {
        console.error('Error updating branch:', err);
      }
    });
  } else {
    console.error('Form is invalid or no branch selected.');
  }
}



  // Delete a branch
  deleteBranch(id: number): void {
    this.branchService.deleteBranch(id).subscribe(() => {
      this.loadBranches(); // Reload branches
    });
  }

  // Form validation helpers
  isFieldInvalid(field: string): any {
    const control = this.form.get(field);
    return control?.invalid && control?.touched;
  }

  getFieldError(field: string): string {
    const control = this.form.get(field);
    if (control?.hasError('required')) {
      return 'This field is required.';
    }
    if (control?.hasError('maxlength')) {
      return 'Maximum length exceeded.';
    }
    return '';
  }

}
