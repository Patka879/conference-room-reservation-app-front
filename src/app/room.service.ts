import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Room } from './room'

const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Access-Control-Allow-Origin': '*'
    })
  };

  @Injectable({
    providedIn: 'root'
  })

  export class RoomService {
    private getRoomsLink = "http://localhost:8080/room/all"
    private createRoomUrl = "http://localhost:8080/room/new"
    private deleteUrl = "http://localhost:8080/room/delete/"

    constructor(private http:HttpClient) { }

    getRooms(): Observable<Room[]> {
        return this.http.get<Room[]>(this.getRoomsLink, httpOptions)
    }

    addRoom(room : Room): Observable<any> {
    return this.http.post (
        this.createRoomUrl,
        room,
        httpOptions
        )
    }

    deleteRoom(arg0: number): Observable<any> {
        return this.http.delete(this.deleteUrl + arg0, httpOptions)
    }

  }
