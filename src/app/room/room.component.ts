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
    newRoom: Room =  new Room(0 ,"", 0, 0, true, 0 )
    displayedColumns: string[] = ['id', 'name', 'identifier', 'level', 'availability', 'numberOfPlaces'];
    errorMessage: string = ''
  
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
        },
        (error) => {
          this.errorMessage = error.message; 
        }
      );
    }
  
    deleteRoom(arg0: number): void {
      this.service.deleteRoom(arg0).subscribe(() => {
        this.loadRooms();
      });
    }
  
    resetForm(): void {
      this.newRoom = new Room(0 ,"", 0, 0, true, 0 );
    }
  
  }
