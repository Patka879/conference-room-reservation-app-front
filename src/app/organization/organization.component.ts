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

constructor(private service:OrganizationService) {}

  ngOnInit(): void {
    this.loadOrganizations
  }

  loadOrganizations():void {
    this.service.getOrganizations().subscribe((list: Organization[]) => {
      this.organizations = list
    })
  }

  createOrganization():void {
    this.service.addOrganization(this.newOrganization).subscribe(() => {
      this.loadOrganizations();
  
    });
  }

  deleteOrganization(arg0: number): void {
    this.service.deleteOrganization(arg0).subscribe(() => {
      this.loadOrganizations();
    });
  }

}