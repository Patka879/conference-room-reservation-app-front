export class Room {
    "id": number
    "name": string
    "identifier": string
    "level": number
    "availability": boolean
    "numberOfSittingPlaces": number
    "numberOfStandingPlaces": number

    constructor(id: number, name: string, identifier: string, level: number, availability: boolean, numberOfSittingPlaces: number, numberOfStandingPlaces: number) {
        this.id = id;
        this.name = name;
        this.identifier = identifier;
        this.level = level;
        this.availability = availability;
        this.numberOfSittingPlaces = numberOfSittingPlaces;
        this.numberOfStandingPlaces = numberOfStandingPlaces
    }
}