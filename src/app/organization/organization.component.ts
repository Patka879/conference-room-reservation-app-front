import { Component, OnInit, ViewChild } from '@angular/core';
import { Organization } from '../organization';
import { OrganizationService } from '../organization.service';
import { trigger, style, animate, transition } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

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
  organizations: Organization[] = [];
  newOrganization: Organization = new Organization(0, '');
  existingOrganizationName: string = '';
  newOrganizationName: string = '';
  displayedColumns: string[] = ['organizationId', 'organizationName', 'organizationDelete'];
  errorMessage: string = '';
  successMessage: string = '';
  updateSuccessMessage: string = '';
  updateErrorMessage: string = '';

  dataSource = new MatTableDataSource<Organization>(this.organizations);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private service: OrganizationService) {}

  ngOnInit(): void {
    this.loadOrganizations();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadOrganizations(): void {
    this.service.getOrganizations().subscribe((list: Organization[]) => {
      this.organizations = list;
      this.dataSource = new MatTableDataSource(this.organizations);
      this.dataSource.paginator = this.paginator;
    });
  }

  createOrganization(): void {
    this.service.addOrganization(this.newOrganization).subscribe(
      () => {
        this.loadOrganizations();
        this.resetForm();
        this.errorMessage = '';
        this.showSuccessMessage('Organization added successfully');
      },
      (error) => {
        console.log(error.error);
        this.errorMessage = error.error;
        this.showErrorMessage('This organization already exists!');
      }
    );
  }

  deleteOrganization(id: number): void {
    this.service.deleteOrganization(id).subscribe(() => {
      this.loadOrganizations();
    });
  }

  resetForm(): void {
    this.newOrganization = new Organization(0, '');
  }

  updateOrganization(): void {
    const organizationToUpdate = this.organizations.find(
      (organization) => organization.name === this.existingOrganizationName
    );
  
    if (organizationToUpdate) {
      const existingOrganization = this.organizations.find(
        (organization) =>
          organization.name === this.newOrganizationName &&
          organization.id !== organizationToUpdate.id
      );
      if (existingOrganization) {
        this.showUpdateErrorMessage('An organization with the same name already exists');
        return;
      }
  
      organizationToUpdate.name = this.newOrganizationName;
  
      this.service.updateOrganization(organizationToUpdate).subscribe(
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
  

  resetUpdateForm(): void {
    this.existingOrganizationName = '';
    this.newOrganizationName = '';
    this.updateSuccessMessage = '';
    this.updateErrorMessage = '';
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
