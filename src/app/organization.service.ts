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
    private getOrganizationsLink = "/bookey-api/organization/all"
    private createOrganizationUrl = "/bookey-api/organization/new"
    private deleteUrl = "/bookey-api/organization/delete/"
    private updateUrl = "/bookey-api/organization/replace/"
  
    constructor(private http:HttpClient) { }

    getOrganizations(): Observable<Organization[]> {
        const data = this.http.get<Organization[]>(this.getOrganizationsLink, httpOptions)
        console.log(data)
        return data
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
      const url = `/bookey-api/organization/${organizationId}/add-room/${roomId}`;
      return this.http.patch(url, httpOptions);
    }

    removeRoomFromOrganization(organizationId: number, roomName: string): Observable<any> {
      const url = `/bookey-api/organization/${organizationId}/remove-room/${roomName}`;
      return this.http.post(url, httpOptions);
    }
    

  }
