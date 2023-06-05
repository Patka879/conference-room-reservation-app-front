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
  newRoom: Room =  new Room(0, "", "", 0, true, 0, 0 )
  displayedColumns: string[] = ['id', 'name', 'identifier', 'level', 'availability', 'numberOfSittingPlaces', 'numberOfStandingPlaces', 'delete'];
  existingRoomId: number | undefined;
  newRoomName: string = '';
  newRoomIdentifier: string = '';
  newRoomLevel: number = 0;
  newRoomNumberOfSittingPlaces: number = 0;
  newRoomNumberOfStandingPlaces: number = 0;
  newRoomAvailability: boolean = true;
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
      this.dataSource.data = this.rooms; // Update the data source
      this.dataSource.paginator = this.paginator;
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
  
    if (this.newRoom.level < 0 || this.newRoom.level > 10) {
      this.showAddErrorMessage('Level must be between 0 and 10');
      return;
    }
  
    this.newRoom.name = this.newRoom.name.toLowerCase();
  
    this.service.addRoom(this.newRoom).subscribe(
      () => {
        this.loadRooms();
        this.resetForm();
        this.showAddSuccessMessage('Room added successfully');
      },
      (error) => {
        this.showAddErrorMessage(error.error);
      }
    );
  }
  
  

  updateRoom(): void {
    const roomIdToFind = Number(this.existingRoomId);
    const roomToUpdate = this.rooms.find((room) => room.id === roomIdToFind);
  
    if (roomToUpdate) {
      const existingRoom = this.rooms.find(
        (room) => room.name === this.newRoomName && room.id !== roomToUpdate.id
      );
      if (existingRoom) {
        this.showUpdateErrorMessage(`A room with the name ${existingRoom.name} already exists`);
        return;
      }
  
      if (this.newRoomNumberOfSittingPlaces && this.newRoomNumberOfSittingPlaces < 0) {
        this.showUpdateErrorMessage('Invalid number of sitting places. The number must be non-negative.');
        return;
      }
      if (this.newRoomNumberOfStandingPlaces && this.newRoomNumberOfStandingPlaces < 0) {
        this.showUpdateErrorMessage('Invalid number of standing places. The number must be non-negative.');
        return;
      }
  
      const updatedRoom: Room = {
        ...roomToUpdate,
        name: this.newRoomName ? this.newRoomName : roomToUpdate.name,
        identifier: roomToUpdate.identifier, // Keep the existing identifier
        level: this.newRoomLevel ? this.newRoomLevel : roomToUpdate.level,
        numberOfSittingPlaces: this.newRoomNumberOfSittingPlaces ? this.newRoomNumberOfSittingPlaces : roomToUpdate.numberOfSittingPlaces,
        numberOfStandingPlaces: this.newRoomNumberOfStandingPlaces ? this.newRoomNumberOfStandingPlaces : roomToUpdate.numberOfStandingPlaces,
      };
  
      this.service.updateRoom(updatedRoom).subscribe(
        () => {
          this.loadRooms();
          this.resetUpdateForm();
          this.showUpdateSuccessMessage('Room updated successfully');
        },
        (error) => {
          this.showUpdateErrorMessage(error.error);
        }
      );
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

  resetUpdateForm(): void {
    this.existingRoomId = undefined;
    this.newRoomName = '';
    this.newRoomIdentifier = '';
    this.newRoomLevel = 0;
    this.newRoomNumberOfSittingPlaces = 0;
    this.newRoomNumberOfStandingPlaces = 0;
  }
}
