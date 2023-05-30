import { Component, OnInit, ViewChild } from '@angular/core';
import { Organization } from '../organization';
import { OrganizationService } from '../organization.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import {LiveAnnouncer} from '@angular/cdk/a11y';


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

}