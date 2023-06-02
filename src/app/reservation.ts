import { Room } from './room';
import { Organization } from './organization';

export class Reservation {
  id: number;
  identifier: string;
  organization: Organization;
  room: Room;
  date: Date;
  startTime: string;
  endTime: string;

  constructor(
    id: number,
    identifier: string,
    organization: Organization,
    room: Room,
    date: Date = new Date(),
    startTime: string = '',
    endTime: string = ''
  ) {
    this.id = id;
    this.identifier = identifier;
    this.organization = organization;
    this.room = room;
    this.date = date;
    this.startTime = startTime;
    this.endTime = endTime;
  }
}

