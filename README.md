
# BOOKER - CONFERENCE ROOM RESERVATION SYSTEM
##### Project back-end repository: https://github.com/Patka879/finalProject
##### Project front-end repository: https://github.com/Patka879/finalProjectFrontend


## Table of contents
* [General info](#general-info)
* [Rules of the application](#rules-of-the-application)
* [Technologies](#technologies)
* [Setup](#setup)
* [Author](#author)

## General info
System created for managing reservations for conference rooms within one building, for multiple organizations.
This repository contains front-end code of the project. In order to find front-end code, please refer to the back-end repository.

## Rules of the application
### Rooms:
* Room name (unique in the system, min 2 characters, max 20
  character, can't be blank)
* Identifier / room number (unique in the system, can't be blank or example: "1.33")
* Level (number 0-10)
* Availability (true/false)
### Organizations
* Organization name (unique in the system, min 2 characters, max 20
  character, can't be blank)
* Any number of rooms can be added to given organization
* One room can be added to only one organization at a time. 
* Organization can't be deleted if there are reservations for given organization.
### Reservations
* Identifier (unique in the system, min 2 characters, max 20 character, can't
  be blank)
* Start date can't be created for current date because rooms must be prepared. 
* A reservation can be made only for one full day. In order to create reservation for two days, please create Two 
separate reservations
* Reservation can't be made for past days.
* Reservation can be made only two weeks in advance. 
* Start Time must be before end time of the reservation.
* Start Time must be after 5:59AM and before 7:01PM
* End Time must be after 5:59AM and before 8:01pm
* Reservation for given room can be only made if this room is associated with given reservation. 

## Setup
* Steps to run the project:

Clone the repository:
```
$ git clone git@github.com:Patka879/my-portfolio.git
```

* Navigate to root of the project in terminal
* Install angular CLI to be able to run necessary commands: 
```
$ npm install -g @angular/cli
```
* Install all dependencies for the project: 
```
npm install
```
* Start the project: 
```
npm start
```

Steps to build the project:
* Execute: 
```
$ npm run build
* Copy the entirety of dist folder on Your static server
* Command to prepare production docker image to be deployed: 
```
docker build -t final-project .
```

## Technologies
* angular: "^16.0.2"
* docker
* nginx

## Author
[@Patrycja Mysiak](https://github.com/Patka879)



