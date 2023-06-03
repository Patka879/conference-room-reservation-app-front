import { Room } from './room';
import { Organization } from './organization';

export class Reservation {
  id: number;
  identifier: string;
  organization: Organization;
  room: Room;
  date: Date | undefined;
  startTime: string | undefined;
  endTime: string | undefined;

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

