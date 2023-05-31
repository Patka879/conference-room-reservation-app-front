import { Component, OnInit, ViewChild } from '@angular/core';
import { Organization } from '../organization';
import { OrganizationService } from '../organization.service';
import { trigger, style, animate, transition } from '@angular/animations';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';

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
  newOrganization: Organization =  new Organization(0 ,"")
  existingOrganizationName: string = '';
  newOrganizationName: string = '';
  displayedColumns: string[] = ['id', 'name','delete']
  errorMessage: string = ''
  successMessage: string = '';

  dataSource = new MatTableDataSource<Organization>(this.organizations);
  
  @ViewChild(MatPaginator)
  paginator!: MatPaginator
  
  constructor(private service: OrganizationService) { 
  }

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
      this.dataSource.paginator = this.paginator
    });
  }

  createOrganization(): void {
    this.service.addOrganization(this.newOrganization).subscribe(
      () => {
        this.loadOrganizations();
        this.resetForm();
        this.errorMessage = ''; // Clear the error message
        this.showSuccessMessage('Organization added successfully'); // Display success message
      },
      (error) => {
        console.log(error.error);
        this.errorMessage = error.error;
        this.showErrorMessage('Failed to add organization'); // Display error message
      }
    );
  }


  showSuccessMessage(message: string): void {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = ''; // Clear the success message after a certain time
    }, 3000); // Set the duration for which the success message is displayed (in milliseconds)
  }

  showErrorMessage(message: string): void {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = ''; // Clear the success message after a certain time
    }, 3000); // Set the duration for which the success message is displayed (in milliseconds)
  }

  deleteOrganization(arg0: number): void {
    this.service.deleteOrganization(arg0).subscribe(() => {
      this.loadOrganizations();
    });
  }

  resetForm(): void {
    this.newOrganization = new Organization(0 ,"");
  }

  updateOrganization(): void {
    const organizationToUpdate = this.organizations.find(
      (organization) => organization.name === this.existingOrganizationName
    );

    if (organizationToUpdate) {
      organizationToUpdate.name = this.newOrganizationName;

      this.service.updateOrganization(organizationToUpdate).subscribe(
        () => {
          this.resetUpdateForm();
          this.loadOrganizations();
          
        },
        (error) => {
          this.errorMessage = error.message
        }
      );
    }
  }

  resetUpdateForm(): void {
    this.existingOrganizationName = '';
    this.newOrganizationName = '';
  }
}