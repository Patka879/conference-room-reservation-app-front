import { Component, OnInit, ViewChild } from '@angular/core'
import { Organization } from '../organization'
import { OrganizationService } from '../organization.service'
import { trigger, style, animate, transition } from '@angular/animations'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { RoomService } from '../room.service'
import { Reservation } from '../reservation'
import { ReservationService } from '../reservation.service'
import { Room } from '../room';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css'],
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

export class ReservationComponent implements OnInit {
  reservations: Reservation[] = [];
  newReservation: Reservation = {
    id: 0,
    identifier: '',
    organization: new Organization(0, ''),
    room: new Room(0, '', '', 0, false, 0, 0),
    date: new Date(),
    startTime: '',
    endTime: ''
  };
  displayedColumns: string[] = [
    'identifier',
    'organization',
    'room',
    'date',
    'startTime',
    'endTime',
    'reservationDelete'
  ];
  errorMessage: string = '';
  successMessage: string = '';
  updateSuccessMessage: string = '';
  updateErrorMessage: string = '';
  dataSource = new MatTableDataSource<Reservation>(this.reservations);
  organizations: Organization[] = [];
  rooms: Room[] = [];
  currentDate: Date = new Date();
  existingReservationId: number | undefined;
  newReservationIdentifier: string = '';
  newReservationStartTime: string | undefined;
  newReservationEndTime: string | undefined;
  newReservationDate: Date | undefined;
  selectedOrganization: Organization | undefined;
  selectedRoom: Room | undefined;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  

  constructor(
    private reservationService: ReservationService,
    private organizationService: OrganizationService,
    private roomService: RoomService
  ) {}

  ngOnInit(): void {
    this.loadReservations();
    this.loadOrganizations();
    this.loadRooms();
  }

  loadReservations(): void {
    this.reservationService.getReservations().subscribe((list: Reservation[]) => {
      this.reservations = list;
      this.dataSource.data = this.reservations;
      this.dataSource.paginator = this.paginator;
    });
  }

  loadOrganizations(): void {
    this.organizationService.getOrganizations().subscribe((list: Organization[]) => {
      this.organizations = list;
    });
  }

  loadRooms(): void {
    this.roomService.getRooms().subscribe((list: Room[]) => {
      this.rooms = list;
    });
  }

  addReservation(): void {
    if (
      !this.newReservation.identifier ||
      !this.newReservation.organization.id ||
      !this.newReservation.room.id ||
      !this.newReservation.date ||
      !this.newReservation.startTime ||
      !this.newReservation.endTime
    ) {
      this.showAddErrorMessage('Please fill in all required fields.');
      return;
    }

    const today = new Date();
  
    const newReservationDate = new Date(this.newReservation.date);
    newReservationDate.setHours(6, 0);
    this.newReservation.date = newReservationDate

    console.log('new reservarion start time', this.newReservation.date)

    const isIdentifierUsed = this.reservations.some(
      (reservation) =>
        reservation.identifier.toLowerCase() ===
        this.newReservation.identifier.toLowerCase()
        
    );
    if (isIdentifierUsed) {
      this.showAddErrorMessage(
        'Identifier is already used in a previous reservation.'
      );
      return;
    }

    this.reservationService
      .addReservation(
        this.newReservation.organization.id,
        this.newReservation.room.id,
        this.newReservation
      )
      .subscribe(
        () => {
          this.showAddSuccessMessage('Reservation added successfully.');
          this.loadReservations();
          this.resetForm();
        },
        (error: any) => {
          this.showAddErrorMessage(error.error);
        }
      );
  }

  resetForm(): void {
    const newDate = new Date();
    newDate.setHours(6, 0);
    this.newReservation = {
      id: 0,
      identifier: '',
      organization: new Organization(0, ''),
      room: new Room(0, '', '', 0, false, 0, 0),
      date: newDate,
      startTime: '',
      endTime: ''
    };
  }

  deleteReservation(id: number): void {
    this.reservationService.deleteReservation(id).subscribe(
      () => {
        this.loadReservations();
      },
      (error: any) => {
        this.showAddErrorMessage('Failed to delete reservation.');
      }
    );
  }

  updateReservation(): void {
    const reservationIdToFind = Number(this.existingReservationId);
    const reservationToUpdate = this.reservations.find((reservation) => reservation.id === reservationIdToFind);
  
    if (reservationToUpdate) {
      if (this.newReservationIdentifier && (this.newReservationIdentifier.length < 2 || this.newReservationIdentifier.length > 20)) {
        this.showUpdateErrorMessage('Invalid identifier length. The identifier must have at least 2 characters and at most 20 characters.');
        return;
      }
  
      if (this.newReservationDate) {
        const currentDate = new Date();
        const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  
        const newReservationDate = new Date(this.newReservationDate);
        newReservationDate.setHours(6, 0);
        this.newReservationDate = newReservationDate;
  
        if (this.newReservationDate < today) {
          this.showUpdateErrorMessage('Cannot make a reservation for a past date');
          return;
        }
  
        const maxAllowedDate = new Date();
        maxAllowedDate.setDate(maxAllowedDate.getDate() + 14);
  
        if (this.newReservationDate > maxAllowedDate) {
          this.showUpdateErrorMessage('Cannot make a reservation more than two weeks in advance');
          return;
        }
      }
  
      if (this.newReservationStartTime && this.newReservationEndTime) {
        if (this.newReservationEndTime <= this.newReservationStartTime) {
          this.showUpdateErrorMessage('End time must be after start time');
          return;
        }
      }
  
      const updatedReservation: Reservation = {
        ...reservationToUpdate,
        identifier: this.newReservationIdentifier ? this.newReservationIdentifier : reservationToUpdate.identifier,
        date: this.newReservationDate ? new Date(this.newReservationDate) : reservationToUpdate.date,
        startTime: this.newReservationStartTime ? this.newReservationStartTime : reservationToUpdate.startTime,
        endTime: this.newReservationEndTime ? this.newReservationEndTime : reservationToUpdate.endTime,
      };
  
      this.reservationService.updateReservation(updatedReservation).subscribe(
        () => {
          this.loadReservations();
          this.resetUpdateForm();
          this.showUpdateSuccessMessage('Reservation updated successfully');
        },
        (error: any) => {
          this.showUpdateErrorMessage(error.error);
        }
      );
    }
  }
  
  showAddSuccessMessage(message: string): void {
    this.successMessage = message;
    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  showAddErrorMessage(message: string): void {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
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

  formatTime(timeString: string): string {
    const timeParts = timeString.split(':');
    const time = new Date();
    time.setHours(Number(timeParts[0]), Number(timeParts[1]));
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  resetUpdateForm(): void {
    this.existingReservationId = undefined;
    this.newReservationIdentifier = '';
    this.newReservationDate = undefined;
    this.newReservationStartTime = undefined;
    this.newReservationEndTime = undefined;
  }
}
