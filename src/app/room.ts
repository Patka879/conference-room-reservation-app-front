export class Room {
    "id": number
    "name": string
    "identifier": number
    "level": number
    "availability": boolean
    "numberOfPlaces": number;

    constructor(id: number, name: string, identifier: number, level: number, availability: boolean, numberOfPlaces: number) {
        this.id = id;
        this.name = name;
        this.identifier = identifier;
        this.level = level;
        this.availability = availability;
        this.numberOfPlaces = numberOfPlaces;
    }
}