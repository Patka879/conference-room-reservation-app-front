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

    const today = new Date();
    console.log(today);
  
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);

    const reservationDate = new Date(this.newReservation.date);

    if (reservationDate.getDate() == today.getDate()) {
      this.showAddErrorMessage('Reservations for the current date are not possible.');
      return;
    }

    if (reservationDate > twoWeeksFromNow) {
      this.showAddErrorMessage(
        'Reservations can only be made up to two weeks in advance.'
      );
      return;
    }

    const startTime = new Date();
    const startTimeParts = this.newReservation.startTime.split(':');
    startTime.setHours(Number(startTimeParts[0]), Number(startTimeParts[1]));

    const endTime = new Date();
    const endTimeParts = this.newReservation.endTime.split(':');
    endTime.setHours(Number(endTimeParts[0]), Number(endTimeParts[1]));

    const startHour = startTime.getHours();
    if (startHour < 6 || startHour >= 19) {
      this.showAddErrorMessage(
        'Start of the reservation must be between 6 am and 7 pm.'
      );
      return;
    }

    const endHour = endTime.getHours();
    if (endHour >= 20) {
      this.showAddErrorMessage('Reservation must end before 8 pm.');
      return;
    }

    if (endTime <= startTime) {
      this.showAddErrorMessage('Reservation end time should be after start time');
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
          this.showAddErrorMessage('Failed to add reservation.');
        }
      );
  }

  resetForm(): void {
    this.newReservation = {
      id: 0,
      identifier: '',
      organization: new Organization(0, ''),
      room: new Room(0, '', '', 0, false, 0, 0),
      date: new Date(),
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

    const reservationToUpdate = this.reservations.find(
      (reservation) => reservation.id === reservationIdToFind
    );
  
    if (reservationToUpdate) {
      const existingReservation = this.reservations.find(
        (reservation) =>
          reservation.identifier === this.newReservationIdentifier &&
          reservation.id !== reservationToUpdate.id
      );
      if (existingReservation) {
        this.showUpdateErrorMessage(
          'A reservation with the same identifier already exists'
        );
        return;
      }
      
      if(this.newReservationIdentifier) {
        reservationToUpdate.identifier = this.newReservationIdentifier;
      }
  
      if (this.newReservationDate) {
        reservationToUpdate.date = this.newReservationDate;
      }
  
      if (this.newReservationStartTime) {
        reservationToUpdate.startTime = this.newReservationStartTime;
      }
  
      if (this.newReservationEndTime) {
        reservationToUpdate.endTime = this.newReservationEndTime;
      }
  
      this.reservationService
        .updateReservation(reservationToUpdate)
        .subscribe(
          () => {
            this.loadReservations();
            this.resetUpdateForm();
            this.showUpdateSuccessMessage('Reservation updated successfully');
          },
          (error: any) => {
            this.showUpdateErrorMessage('Failed to update reservation');
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
