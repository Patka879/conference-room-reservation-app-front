import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Reservation } from './reservation'

const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };

  @Injectable({
    providedIn: 'root'
  })

  export class ReservationService {
    private getReservationsLink = "http://localhost:8080/reservation/all"
    private createReservationUrl = "http://localhost:8080/reservation/new"
    private deleteReservationUrl = "http://localhost:8080/reservation/delete/"


    constructor(private http:HttpClient) { }

    getReservations(): Observable<Reservation[]> {
        return this.http.get<Reservation[]>(this.getReservationsLink, httpOptions)
    }

    addReservation(reservation : Reservation): Observable<any> {
    return this.http.post (
        this.createReservationUrl,
        reservation,
        httpOptions
        )
    }

    deleteReservation(arg0: number): Observable<any> {
      return this.http.delete(this.deleteReservationUrl + arg0, httpOptions)
  }
}