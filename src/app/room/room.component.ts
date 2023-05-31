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
        style({ transform: 'translateX(100%)' }),
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
  newRoom: Room =  new Room(0, "", "", 0, false, 0, 0 )
  displayedColumns: string[] = ['id', 'name', 'identifier', 'level', 'availability', 'numberOfSittingPlaces', 'numberOfStandingPlaces', 'delete'];
  existingRoomId: number | undefined;
  newRoomName: string = '';
  newRoomIdentifier: string = '';
  newRoomLevel: number = 0;
  newRoomNumberOfSittingPlaces: number = 0;
  newRoomNumberOfStandingPlaces: number = 0;
  newRoomAvailability: boolean = false;
  addErrorMessage: string = '';
  updateErrorMessage: string = '';
  addSuccessMessage: string = '';
  updateSuccessMessage: string = '';

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
  
  deleteRoom(arg0: number): void {
    this.service.deleteRoom(arg0).subscribe(() => {
      this.loadRooms();
    });
  }

  resetForm(): void {
    this.newRoom = new Room(0, "", "", 0, true, 0, 0);
  }

  createRoom(): void {
    // Check if all fields are filled
    if (
      !this.newRoom.name ||
      !this.newRoom.identifier ||
      !this.newRoom.level ||
      !this.newRoom.numberOfSittingPlaces ||
      !this.newRoom.numberOfStandingPlaces
    ) {
      this.showAddErrorMessage('Please fill in all fields');
      return;
    }
  
    // Check if a room with the same name already exists
    const existingRoom = this.rooms.find((room) => room.name === this.newRoom.name);
    if (existingRoom) {
      this.showAddErrorMessage('A room with the same name already exists');
      return;
    }
  
    this.service.addRoom(this.newRoom).subscribe(
      () => {
        this.loadRooms();
        this.resetForm();
        this.showAddSuccessMessage('Room added successfully');
      },
      (error) => {
        console.log(error.error);
        this.showAddErrorMessage('Error occurred while adding the room');
      }
    );
  }
  
  updateRoom(): void {
    const roomIdToFind = Number(this.existingRoomId);
  
    const roomToUpdate = this.rooms.find((room) => room.id === roomIdToFind);
  
    if (roomToUpdate) {
  
      const existingRoom = this.rooms.find((room) => room.name === this.newRoomName && room.id !== roomToUpdate.id);
      if (existingRoom) {
        this.showUpdateErrorMessage('A room with the same name already exists');
        return;
      }
  
      if (this.newRoomName) {
        roomToUpdate.name = this.newRoomName;
      }
      if (this.newRoomIdentifier) {
        roomToUpdate.identifier = this.newRoomIdentifier;
      }
      if (this.newRoomLevel) {
        roomToUpdate.level = this.newRoomLevel;
      }
      if (this.newRoomNumberOfSittingPlaces) {
        roomToUpdate.numberOfSittingPlaces = this.newRoomNumberOfSittingPlaces;
      }
      if (this.newRoomNumberOfStandingPlaces) {
        roomToUpdate.numberOfStandingPlaces = this.newRoomNumberOfStandingPlaces;
      }
      if (this.newRoomAvailability !== undefined) {
        roomToUpdate.availability = this.newRoomAvailability;
      }
  
      this.service.updateRoom(roomToUpdate).subscribe(() => {
        this.loadRooms();
        this.resetForm();
        this.showUpdateSuccessMessage('Room updated successfully');
      });
    }
  }
  
  
  showAddSuccessMessage(message: string): void {
    this.addSuccessMessage = message;
    setTimeout(() => {
      this.addSuccessMessage = '';
    }, 3000);
  }
  
  showAddErrorMessage(message: string): void {
    this.addErrorMessage = message;
    setTimeout(() => {
      this.addErrorMessage = '';
    }, 3000);
  }
  
  showUpdateSuccessMessage(message: string): void {
    this.updateSuccessMessage = message;
    setTimeout(() => {
      this.updateSuccessMessage = '';
    }, 3000);
  }
  
  showUpdateErrorMessage(message: string): void {
    this.updateErrorMessage = message;
    setTimeout(() => {
      this.updateErrorMessage = '';
    }, 3000);
  }

}
