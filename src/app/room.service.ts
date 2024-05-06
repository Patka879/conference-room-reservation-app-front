import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Room } from './room'
 

  @Injectable({
    providedIn: 'root'
  })

  export class RoomService {
    private getRoomsLink = "/bookey-api/room/all"
    private createRoomUrl = "/bookey-api/room/new"
    private deleteUrl = "/bookey-api/room/delete/"
    private updateUrl = "/bookey-api/room/replace/"

    constructor(private http:HttpClient) { }

    getRooms(): Observable<Room[]> {
        return this.http.get<Room[]>(this.getRoomsLink)
    }

    addRoom(room : Room): Observable<any> {
    return this.http.post (
        this.createRoomUrl,
        room,
        )
    }

    deleteRoom(arg0: number): Observable<any> {
        return this.http.delete(this.deleteUrl + arg0)
    }

    updateRoom(room: Room): Observable<any> {
      return this.http.patch(this.updateUrl + room.id, room);
    }

  }
