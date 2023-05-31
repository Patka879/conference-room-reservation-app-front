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

  dataSource = new MatTableDataSource<Organization>(this.organizations);
  
  @ViewChild(MatPaginator)
  paginator!: MatPaginator
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(private service: OrganizationService) { }

  ngOnInit(): void {
    this.loadOrganizations();
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
      },
      (error) => {
        this.errorMessage = error.message; // Set the error message received from the backend
      }
    );
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
    // Find the organization with the selected existing name
    const organizationToUpdate = this.organizations.find(
      (organization) => organization.name === this.existingOrganizationName
    );

    if (organizationToUpdate) {
      // Update the name of the organization
      organizationToUpdate.name = this.newOrganizationName;

      // Call the update/patch API
      this.service.updateOrganization(organizationToUpdate).subscribe(
        () => {
          this.loadOrganizations();
          this.resetUpdateForm();
        },
        (error) => {
          this.errorMessage = error.message; // Set the error message received from the backend
        }
      );
    }
  }

  resetUpdateForm(): void {
    this.existingOrganizationName = '';
    this.newOrganizationName = '';
  }
}