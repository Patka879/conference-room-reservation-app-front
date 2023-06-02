import {Room} from './room'

export class Organization {
  id: number;
  name: string;
  rooms: Room[];
  
  constructor(id: number, name: string, rooms: Room[] = []) {
    this.id = id;
    this.name = name;
    this.rooms = rooms;
  }
}
  