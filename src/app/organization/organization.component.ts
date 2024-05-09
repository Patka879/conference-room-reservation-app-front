import { Component, OnInit, ViewChild } from '@angular/core';
import { Organization } from '../organization';
import { OrganizationService } from '../organization.service';
import { trigger, style, animate, transition } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { RoomService } from '../room.service';
import { Room } from '../room';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css'],
  animations: [
    trigger('slideInAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('400ms ease-out', style({ transform: 'translateY(0%)' }))
      ]),
      transition(':leave', [
        animate('400ms ease-out', style({ transform: 'translateY(-100%)' }))
      ])
    ])
  ]
})

export class OrganizationComponent implements OnInit {
  organizations: Organization[] = []
  newOrganization: Organization = new Organization(0, '', [])
  existingOrganizationName: string = ''
  newOrganizationName: string = ''
  displayedColumns: string[] = ['organizationId', 'organizationName', 'organizationRoom', 'organizationDelete']
  errorMessage: string = ''
  successMessage: string = ''
  updateSuccessMessage: string = ''
  updateErrorMessage: string = ''
  selectedOrganizationId: number = 0;
  selectedOrganizationToUpdateId: number = 0
  selectedOrganizationToAddRoomId: number = 0
  selectedOrganizationToRemoveRoomId: number = 0
  selectedRoomToRemoveName: string = ''
  selectedRoomId: number = 0
  rooms: Room[] = [];
  addRoomSuccessMessage: string = ''
  addRoomErrorMessage: string = ''
  dataSource = new MatTableDataSource<Organization>(this.organizations);
  removeRoomSuccessMessage: string = ''
  removeRoomErrorMessage: string = ''
  todayDate:Date = new Date();
  @ViewChild(MatPaginator) paginator!: MatPaginator
  

  constructor(private organizationService: OrganizationService, private roomService: RoomService) {}

  async ngOnInit(): Promise<void> {
    this.loadOrganizations();
    this.loadRooms();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadOrganizations(): void {
    this.organizationService.getOrganizations().subscribe((list: Organization[]) => {
      this.organizations = list;
      this.dataSource.paginator = this.paginator;
      this.dataSource = new MatTableDataSource(this.organizations);
    });
  }

  loadRooms(): void {
    this.roomService.getRooms().subscribe((rooms: Room[]) => {
      this.rooms = rooms;
      this.dataSource.data = this.organizations; // Update the data source
    });
  }

  createOrganization(): void {
    const existingOrganization = this.organizations.find(organization =>
      organization.name.toLowerCase() === this.newOrganization.name.toLowerCase()
    );
  
    if (existingOrganization) {
      this.showAddOrganizationErrorMessage('This organization already exists!');
      return;
    }
  
    if (this.newOrganization.name.trim() === '') {
      this.showAddOrganizationErrorMessage('Organization name cannot be empty');
      return;
    }
  
    this.organizationService.addOrganization(this.newOrganization).subscribe({
      complete: () => {
        this.loadOrganizations();
        this.resetForm();
        this.errorMessage = '';
        this.showAddOrganizationSuccessMessage('Organization added successfully');
      },
      error: () => {
        this.showAddOrganizationErrorMessage('Error adding organization');
      }
    });
  }

  updateOrganization(): void {
    const organizationToUpdate = this.organizations.find(
      (organization) => organization.id === this.selectedOrganizationToUpdateId
    );
  
    if (organizationToUpdate) {
      if (this.newOrganizationName.length < 2) {
        this.showUpdateErrorMessage('The name must have at least 2 characters.');
        return;
      }
  
      const existingOrganization = this.organizations.find(
        (organization) =>
          organization.name === this.newOrganizationName &&
          organization.id !== organizationToUpdate.id
      );

      if (existingOrganization) {
        this.showAddOrganizationErrorMessage('This organization already exists!');
        return;
      }
  
      let updatedOrganization: Organization = Object.assign({}, organizationToUpdate);
  
      if (this.newOrganizationName) {
        updatedOrganization.name = this.newOrganizationName;
      }
  
      this.organizationService.updateOrganization(updatedOrganization).subscribe(
        () => {
          this.resetUpdateForm();
          this.loadOrganizations();
          this.showUpdateSuccessMessage('Organization updated successfully');
        },
        () => {
          this.showUpdateErrorMessage("Please select all necessary input fields")
        }
      );
    }
  }
  
  addRoomToOrganization(): void {
    this.organizationService.addRoomToOrganization(this.selectedOrganizationToAddRoomId, this.selectedRoomId).subscribe(
      () => {
        this.resetRoomForm();
        this.showAddRoomToOrganizationSuccessMessage("Room added to organization successfully")
        this.loadRooms();
      },
      () => {
        this.showAddRoomToOrganizationErrorMessage("Please select all input fields");
      }
    );
  }

  removeRoomFromOrganization(): void {
    if (this.selectedOrganizationToRemoveRoomId === 0 || this.selectedRoomToRemoveName === '') {
      this.errorMessage;
      return;
    }

    this.organizationService.removeRoomFromOrganization(this.selectedOrganizationToRemoveRoomId, this.selectedRoomToRemoveName).subscribe(
      () => {
        this.resetRoomRemoveForm();
        this.loadOrganizations();
        this.showRemoveRoomFromOrganizationSuccessMessage("Room removed sucesfully from organization")
        this.loadRooms();
      },
      () => {
        this.removeRoomErrorMessage = `Room ${this.selectedRoomToRemoveName} is not associated with this organization.`
        this.showRemoveRoomFromOrganizationErrorMessage(this.removeRoomErrorMessage);
      }
    );
  }
  
  deleteOrganization(id: number): void {
    this.organizationService.deleteOrganization(id).subscribe(() => {
      this.loadOrganizations();
    });
  }

  resetUpdateForm(): void {
    this.existingOrganizationName = '';
    this.newOrganizationName = '';
    this.updateSuccessMessage = '';
    this.updateErrorMessage = '';
  }

  resetForm(): void {
    this.newOrganization = new Organization(0, '', []);
  }

  resetRoomForm(): void {
    this.selectedOrganizationToAddRoomId = 0; 
    this.selectedRoomId = 0;
    this.addRoomSuccessMessage = '';
    this.addRoomErrorMessage = '';
  }

  resetRoomRemoveForm(): void {
    this.selectedOrganizationToRemoveRoomId = 0;
    this.selectedRoomToRemoveName = '';
    this.removeRoomSuccessMessage = '';
    this.removeRoomErrorMessage = '';
  }

  showAddOrganizationSuccessMessage(message: string): void {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  showAddOrganizationErrorMessage(message: string): void {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }

  showUpdateSuccessMessage(message: string): void {
    this.updateSuccessMessage = message;
    setTimeout(() => {
      this.updateSuccessMessage = '';
    }, 3000);
  }

  showUpdateErrorMessage(message: string): void {
    this.updateErrorMessage = message;
    setTimeout(() => {
      this.updateErrorMessage = '';
    }, 3000);
  }

  showAddRoomToOrganizationErrorMessage(message: string): void {
    this.addRoomErrorMessage = message;
    setTimeout(() => {
      this.addRoomErrorMessage = '';
    }, 3000);
  }

  showAddRoomToOrganizationSuccessMessage(message: string): void {
    this.addRoomSuccessMessage = message;
    setTimeout(() => {
      this.addRoomSuccessMessage = '';
    }, 3000);
  }

  showRemoveRoomFromOrganizationSuccessMessage(message: string): void {
    this.removeRoomSuccessMessage = message;
    setTimeout(() => {
      this.removeRoomSuccessMessage = '';
    }, 3000);
  }

  showRemoveRoomFromOrganizationErrorMessage(message: string): void {
    this.removeRoomErrorMessage = message;
    setTimeout(() => {
      this.removeRoomErrorMessage = '';
    }, 3000);
  }
}
