import { Component, OnInit } from '@angular/core';
import { Organization } from '../organization';
import { OrganizationService } from '../organization.service';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css']
})

export class OrganizationComponent implements OnInit {
  organizations: Organization[] = []
  newOrganization: Organization =  new Organization(0 ,"")
  displayedColumns: string[] = ['id', 'name','delete'];
  errorMessage: string = '';

constructor(private service:OrganizationService) {}

  ngOnInit(): void {
    this.loadOrganizations();
  }

  loadOrganizations():void {
    this.service.getOrganizations().subscribe((list: Organization[]) => {
      this.organizations = list
    })
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

}