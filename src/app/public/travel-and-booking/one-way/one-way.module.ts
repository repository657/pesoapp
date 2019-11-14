import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { OneWayPage } from './one-way.page';
import { CalendarModule } from 'ion2-calendar';
import { ModalsPage } from './modals/modals.page';
const routes: Routes = [
  {
    path: '',
    component: OneWayPage
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
  declarations: [OneWayPage, ModalsPage],
  entryComponents: [ModalsPage]
})
export class OneWayPageModule {}
