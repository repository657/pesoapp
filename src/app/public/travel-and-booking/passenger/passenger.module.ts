import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { IonicSelectableModule } from 'ionic-selectable';
import { CalendarModule } from 'ion2-calendar';
import { PassengerPage } from './passenger.page';

const routes: Routes = [
  {
    path: '',
    component: PassengerPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    CalendarModule,
    IonicSelectableModule
  ],
  declarations: [PassengerPage]
})
export class PassengerPageModule {}
