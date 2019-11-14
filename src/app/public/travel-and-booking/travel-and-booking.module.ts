import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TravelAndBookingPage } from './travel-and-booking.page';
import { CalendarModule } from 'ion2-calendar';
const routes: Routes = [
  {
    path: 'tabs',
    component: TravelAndBookingPage,
    children: [
      { path: 'one-way', loadChildren: './one-way/one-way.module#OneWayPageModule' },
      { path: 'round-trip', loadChildren: './round-trip/round-trip.module#RoundTripPageModule' },
    ]
  },
  {
    path: '',
    redirectTo: 'tabs/one-way',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    CalendarModule
  ],
  declarations: [TravelAndBookingPage]
})
export class TravelAndBookingPageModule {}
