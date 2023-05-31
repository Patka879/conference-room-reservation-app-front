import { Component, OnInit, ViewChild } from '@angular/core';
import { Room } from '../room';
import { RoomService } from '../room.service';
import { trigger, style, animate, transition } from '@angular/animations';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
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

export class RoomComponent implements OnInit{
  rooms: Room[] = []
  newRoom: Room =  new Room(0 ,"", 0, 0, false, 0 )
  displayedColumns: string[] = ['id', 'name', 'identifier', 'level', 'availability', 'numberOfPlaces', 'delete'];
  existingRoomId: number | undefined;
  newRoomName: string = '';
  newRoomIdentifier: number = 0;
  newRoomLevel: number = 0;
  newRoomNumberOfPlaces: number = 0;
  newRoomAvailability: boolean = false;
 

  dataSource = new MatTableDataSource<Room>(this.rooms);
  
  @ViewChild(MatPaginator)
  paginator!: MatPaginator
  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(private service: RoomService) { }

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.service.getRooms().subscribe((list: Room[]) => {
      this.rooms = list;
      this.dataSource = new MatTableDataSource(this.rooms);
      this.dataSource.paginator = this.paginator
    });
  }

  createRoom(): void {
    this.service.addRoom(this.newRoom).subscribe(
      () => {
        this.loadRooms();
        this.resetForm();
      }
    )
  }

  deleteRoom(arg0: number): void {
    this.service.deleteRoom(arg0).subscribe(() => {
      this.loadRooms();
    });
  }

  resetForm(): void {
    this.newRoom = new Room(0 ,"", 0, 0, true, 0 );
  }

  updateRoom(): void {
    const roomIdToFind = Number(this.existingRoomId);
    
    const roomToUpdate = this.rooms.find((room) => room.id === roomIdToFind);
  
    if (roomToUpdate) {
      if (this.newRoomName) {
        roomToUpdate.name = this.newRoomName;
      }
      if (this.newRoomIdentifier) {
        roomToUpdate.identifier = this.newRoomIdentifier;
      }
      if (this.newRoomLevel) {
        roomToUpdate.level = this.newRoomLevel;
      }
      if (this.newRoomNumberOfPlaces) {
        roomToUpdate.numberOfPlaces = this.newRoomNumberOfPlaces;
      }
      if (this.newRoomAvailability !== undefined) {
        roomToUpdate.availability = this.newRoomAvailability;
      }
  
      this.service.updateRoom(roomToUpdate).subscribe(() => {
        this.loadRooms();
        this.resetUpdateForm();
      });
    }
  }
  

  resetUpdateForm(): void {
    this.existingRoomId = undefined;
    this.newRoomName = '';
    this.newRoomIdentifier = 0;
    this.newRoomLevel = 0;
    this.newRoomNumberOfPlaces = 0;
    this.newRoomAvailability = false;
  }

}
