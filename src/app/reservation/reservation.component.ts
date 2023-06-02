import { Component, OnInit, ViewChild } from '@angular/core'
import { Organization } from '../organization'
import { OrganizationService } from '../organization.service'
import { trigger, style, animate, transition } from '@angular/animations'
import { MatTableDataSource } from '@angular/material/table'
import { MatPaginator } from '@angular/material/paginator'
import { RoomService } from '../room.service'
import { Reservation } from '../reservation'
import { ReservationService } from '../reservation.service'
import { Room } from '../room'


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
  reservations: Reservation[] = []
  newReservation: Reservation = new Reservation(
    0,
    '',
    new Organization(0, ''),
    new Room(0, '', '', 0, false, 0, 0),
    undefined,
    undefined,
    undefined
  )
  displayedColumns: string[] = [
    'identifier',
    'organization',
    'room',
    'date',
    'startTime',
    'endTime',
    'reservationDelete'
  ]
  errorMessage: string = ''
  successMessage: string = ''
  dataSource = new MatTableDataSource<Reservation>(this.reservations)
  organizations: Organization[] = []
  rooms: Room[] = []
  currentDate: Date = new Date()
  @ViewChild(MatPaginator) paginator!: MatPaginator


  constructor(
    private reservationService: ReservationService,
    private organizationService: OrganizationService,
    private roomService: RoomService
  ) {}

  ngOnInit(): void {
    this.loadReservations()
    this.loadOrganizations()
    this.loadRooms()
  }

  loadReservations(): void {
    this.reservationService.getReservations().subscribe((list: Reservation[]) => {
      this.reservations = list
      this.dataSource.data = this.reservations
      this.dataSource.paginator = this.paginator
    })
  }

  loadOrganizations(): void {
    this.organizationService.getOrganizations().subscribe((list: Organization[]) => {
      this.organizations = list
    })
  }

  loadRooms(): void {
    this.roomService.getRooms().subscribe((list: Room[]) => {
      this.rooms = list
    })
  }

  addReservation(): void {
    if (
      !this.newReservation.identifier ||
      !this.newReservation.organization ||
      !this.newReservation.room ||
      !this.newReservation.date ||
      !this.newReservation.startTime ||
      !this.newReservation.endTime
    ) {
      this.errorMessage = 'Please fill in all required fields.'
      return
    }
  
    const isIdentifierUsed = this.reservations.some(
      (reservation) =>
        reservation.identifier.toLowerCase() ===
        this.newReservation.identifier.toLowerCase()
    )
    if (isIdentifierUsed) {
      this.errorMessage = 'Identifier is already used in a previous reservation.'
      return
    }
    
    const twoWeeksFromNow = new Date()
    twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14) // Add 14 days (two weeks)
    if (this.newReservation.date > twoWeeksFromNow) {
      this.errorMessage = 'Reservations can only be made up to two weeks in advance.'
      return
    }
    
    
    const startTime = new Date()
    const startTimeParts = this.newReservation.startTime.split(':')
    startTime.setHours(Number(startTimeParts[0]), Number(startTimeParts[1]))

    const endTime = new Date()
    const endTimeParts = this.newReservation.endTime.split(':')
    endTime.setHours(Number(endTimeParts[0]), Number(endTimeParts[1]))

    const startHour = startTime.getHours()
    if (startHour < 6 || startHour >= 19) {
      this.errorMessage = 'Start of the reservation must be between 6 am and 7 pm.'
      return
    }

    const endHour = endTime.getHours()
    if (endHour >= 20) {
      this.errorMessage = 'Reservation must end before 8 pm.'
      return
    }

    if (endTime <= startTime) {
      this.errorMessage = 'Reservation end time should be after start time'
      return
    }


  
  this.reservationService
    .addReservation(this.newReservation)
    .subscribe(
      (createdReservation: Reservation) => {
        this.newReservation = new Reservation(
          0,
          '',
          new Organization(0, ''),
          new Room(0, '', '', 0, false, 0, 0),
          undefined,
          undefined,
          undefined
        )
        this.successMessage = 'Reservation created successfully.'
        this.loadReservations()
      },
      (error: any) => {
        this.errorMessage = 'Failed to create reservation.'
      }
    )
  }
  

  deleteReservation(id: number): void {
    this.reservationService.deleteReservation(id).subscribe(() => {
      this.loadReservations()
    })
  }

  formatTime(timeString: string): string {
    const timeParts = timeString.split(':')
    const time = new Date()
    time.setHours(Number(timeParts[0]), Number(timeParts[1]))
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  
}
