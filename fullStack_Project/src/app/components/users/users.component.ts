import { Component, OnInit } from '@angular/core';
import { user } from '../../models/user';
import { AuthService } from '../../Shared/auth.service';
import { CommonModule } from '@angular/common';
import { RolesService } from '../../Shared/roles.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule , FormsModule ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {

  users: user[] = [];  // Holds the list of users
  roles: any[] = [];
  selectedUser: any = null;
  newRoleName: string = '';  // New role name for creating roles

  constructor(private userService: AuthService, private rolesService: RolesService) { }

  ngOnInit(): void {
    this.getUsers();
    this.getAllRoles();
  }

  getUsers(): void {
    this.userService.getUsers().subscribe(data => {
      this.users = data;
    });
  }

  getAllRoles(): void {
    this.rolesService.getAllRoles().subscribe(data => {
      this.roles = data;
    });
  }

  openRoleModal(user: any): void {
    // Open the role modal and set the selected user
    this.selectedUser = { ...user };
    const modal = document.getElementById('roleModal');
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'block';
    }
  }

  toggleRole(roleName: string, event: any): void {
    const email = this.selectedUser.email;

    if (event.target.checked) {
      // Assign the role to the user
      this.rolesService.assignRole(email, roleName).subscribe({
       next: (response) => {
          console.log(`Role ${roleName} assigned to ${email}`);
          // Optionally update the user role list in the UI after successful role assignment
          this.selectedUser.roles.push(roleName);
          this.getUsers();
        //  window.location.reload();
        },
       error: (error) => {
          console.error(`Error assigning role ${roleName} to ${email}:`, error);
          this.getUsers();
         // alert(`Failed to assign role ${roleName}. Please try again.`);
        //  window.location.reload();
        }
    });
    } else {
      // Remove the role from the user
      this.rolesService.removeRole(email, roleName).subscribe({
       next: (response) => {
          console.log(`Role ${roleName} removed from ${email}`);
          // Optionally update the user role list in the UI after successful role removal
          this.selectedUser.roles = this.selectedUser.roles.filter((r: string) => r !== roleName);
       //   window.location.reload();
       this.getUsers();
        },
       error: (error) => {
          console.error(`Error removing role ${roleName} from ${email}:`, error);
          this.getUsers();
        //  alert(`Failed to remove role ${roleName}. Please try again.`);
        //  window.location.reload();
        }
     } );
    }
  }


  updateRoles(): void {
    const email = this.selectedUser.email;
    const roles = this.selectedUser.roles;
    this.rolesService.assignRole(email, roles.join(',')).subscribe(() => {
      this.getUsers(); // Refresh the list of users
      this.closeModal();
    });
  }

  closeModal(): void {
    const modal = document.getElementById('roleModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
    }
  }

  createRole() {
    if (this.newRoleName) {
      this.rolesService.createRole(JSON.stringify(this.newRoleName)).subscribe({
        next: (response) => {
          console.log(response);
          this.newRoleName = ''; // Clear input
          this.getAllRoles(); // Refresh roles after creation
         // window.location.reload();
        },
        error: (error) => {
          // Handle errors here
          console.error('Error creating role:', error );
          console.log("the new role name is : " , this.newRoleName);
          this.getAllRoles();

         // alert('An error occurred while creating the role. Please try again.');
        },
        complete: () => {
          console.log('Role creation completed.');
          this.getAllRoles();
        }
      });
    }
  }

  updateRole(role: any): void {
    const newRoleName = prompt("Enter new role name:", role.name);
    if (newRoleName && newRoleName !== role.name) {
      this.rolesService.updateRole(role.id.toString(), newRoleName).subscribe({
        next :(response) => {
        console.log(response);
        this.getAllRoles(); // Refresh roles after update

    },
  error: (err)=>{
    this.getAllRoles(); // Refresh roles after update
  }
    });
    }
  }

 deleteRole(roleName: string): void {
  if (confirm(`Are you sure you want to delete the role: ${roleName}?`)) {
    this.rolesService.deleteRole(roleName).subscribe(response => {
      console.log(response);
      this.getAllRoles(); // Refresh roles after deletion
    });
  }
}

deleteUser(userId: string) {
  if (confirm("Are you sure you want to delete this user?")) {
    this.userService.deleteUser(userId).subscribe({
      next :(response) => {
        console.log(response);
        this.getUsers(); // Refresh the user list
      },
      error :(error) => {
        console.error('Error deleting user:', error);
        alert('An error occurred while deleting the user. Please try again.');
      }
  });
  }
}

}
