import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservationComponent } from './reservation/reservation.component';
import { OrganizationComponent } from './organization/organization.component';
import { RoomComponent } from './room/room.component';

const routes: Routes = [
  { path: 'reservation', component: ReservationComponent },
  { path: 'organization', component: OrganizationComponent },
  { path: 'room', component: RoomComponent },
  { path: '', redirectTo: '/reservation', pathMatch: 'full' }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
