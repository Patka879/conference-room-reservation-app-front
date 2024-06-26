import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Reservation } from './reservation'

  @Injectable({
    providedIn: 'root'
  })

  export class ReservationService {
    private getReservationsLink = "/bookey-api/reservation/all"
    private deleteReservationUrl = "/bookey-api/reservation/delete/"
    private updateReservationUrl = "/bookey-api/reservation/replace/"


    constructor(private http:HttpClient) { }

    getReservations(): Observable<Reservation[]> {
          return this.http.get<Reservation[]>(this.getReservationsLink)
      }

    addReservation(organizationId: number, roomId: number, reservation: Reservation): Observable<any> {
        const createReservationUrl = `/bookey-api/reservation/new/${organizationId}/${roomId}`;
        return this.http.post(createReservationUrl, reservation);
    }

    deleteReservation(arg0: number): Observable<any> {
      return this.http.delete(this.deleteReservationUrl + arg0)
    }
    
    updateReservation(reservation: Reservation): Observable<any> {
      return this.http.patch(this.updateReservationUrl + reservation.id, reservation);
    }


}