import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Organization } from './organization'

const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };

  @Injectable({
    providedIn: 'root'
  })

  export class OrganizationService {
    private getOrganizationsLink = "http://localhost:8080/organization/all"
    private createOrganizationUrl = "http://localhost:8080/organization/new"
    private deleteUrl = "http://localhost:8080/organization/delete/"
    private updateUrl = "http://localhost:8080/organization/replace/"
  

    constructor(private http:HttpClient) { }

    getOrganizations(): Observable<Organization[]> {
        return this.http.get<Organization[]>(this.getOrganizationsLink, httpOptions)
    }

    addOrganization(organization : Organization): Observable<any> {
    return this.http.post (
        this.createOrganizationUrl,
        organization,
        httpOptions
        )
    }

    deleteOrganization(arg0: number): Observable<any> {
        return this.http.delete(this.deleteUrl + arg0, httpOptions)
    }

    updateOrganization(organization: Organization): Observable<any> {
      return this.http.patch(this.updateUrl + organization.id, organization, httpOptions);
    }

    addRoomToOrganization(organizationId: number, roomId: number): Observable<any> {
      const url = `http://localhost:8080/organization/${organizationId}/add-room/${roomId}`;
      return this.http.patch(url, httpOptions);
    }
    

  }
