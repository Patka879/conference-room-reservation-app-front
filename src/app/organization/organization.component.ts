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
  selectedRoomToRemoveId: number = 0
  selectedRoomId: number = 0
  rooms: Room[] = [];
  addRoomSuccessMessage: string = ''
  addRoomErrorMessage: string = ''
  dataSource = new MatTableDataSource<Organization>(this.organizations);
  removeRoomSuccessMessage: string = ''
  removeRoomErrorMessage: string = ''
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
      console.log("after initializing organisations", list)
      this.organizations = list;
      this.dataSource = new MatTableDataSource(this.organizations);
      this.dataSource.paginator = this.paginator;
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
      this.showErrorMessage('This organization already exists!');
      return;
    }
  
    if (this.newOrganization.name.trim() === '') {
      this.showErrorMessage('Organization name cannot be empty');
      return;
    }
  
    this.organizationService.addOrganization(this.newOrganization).subscribe({
      complete: () => {
        this.loadOrganizations();
        this.resetForm();
        this.errorMessage = '';
        this.showSuccessMessage('Organization added successfully');
      },
      error: (error) => {
        console.log(error.error);
        this.errorMessage = error.error;
        this.showErrorMessage('Error adding organization');
      }
    });
  }

  updateOrganization(): void {
    const organizationToUpdate = this.organizations.find(
      (organization) => organization.id === this.selectedOrganizationToUpdateId
    );
    console.log(organizationToUpdate);

    if (organizationToUpdate) {
      const existingOrganization = this.organizations.find(
        (organization) =>
          organization.name === this.newOrganizationName &&
          organization.id !== organizationToUpdate.id
      );
      console.log(existingOrganization);
      if (existingOrganization) {
        this.showUpdateErrorMessage('An organization with the same name already exists');
        return;
      }

      organizationToUpdate.name = this.newOrganizationName;

      this.organizationService.updateOrganization(organizationToUpdate).subscribe(
        () => {
          this.resetUpdateForm();
          this.loadOrganizations();
          this.showUpdateSuccessMessage('Organization updated successfully');
        },
        (error) => {
          this.updateErrorMessage = error.message;
        }
      );
    }
  }
  
  addRoomToOrganization(): void {
    this.organizationService.addRoomToOrganization(this.selectedOrganizationToAddRoomId, this.selectedRoomId).subscribe(
      () => {
        this.resetRoomForm();
        this.loadOrganizations();
        this.addRoomSuccessMessage = 'Room added to organization successfully'
        this.loadRooms();
      },
      (error) => {
        this.addRoomErrorMessage = error.message;
      }
    );
  }
  
  removeRoomFromOrganization(): void {
    const organizationToUpdate = this.organizations.find(
      (organization) => organization.id === this.selectedOrganizationToRemoveRoomId
    );
  
    if (organizationToUpdate) {
      const roomToRemoveIndex = organizationToUpdate.rooms.findIndex(
        (room) => room.id === this.selectedRoomToRemoveId
      );
  
      if (roomToRemoveIndex !== -1) {
        const roomToRemove = organizationToUpdate.rooms[roomToRemoveIndex];
        organizationToUpdate.rooms.splice(roomToRemoveIndex, 1);
  
        const updatedRoom = { ...roomToRemove, availability: true };
        this.roomService.updateRoom(updatedRoom).subscribe(
          () => {
            this.organizationService.updateOrganization(organizationToUpdate).subscribe(
              () => {
                this.resetRoomRemoveForm();
                this.loadOrganizations();
                this.loadRooms();
                this.removeRoomSuccessMessage = 'Room removed from organization successfully';
              },
              (error) => {
                this.removeRoomErrorMessage = error.message;
              }
            );
          },
          (error) => {
            this.removeRoomErrorMessage = error.message;
          }
        );
      }
    }
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
    this.selectedRoomToRemoveId = 0;
    this.removeRoomSuccessMessage = '';
    this.removeRoomErrorMessage = '';
  }

  showSuccessMessage(message: string): void {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  showErrorMessage(message: string): void {
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
}
