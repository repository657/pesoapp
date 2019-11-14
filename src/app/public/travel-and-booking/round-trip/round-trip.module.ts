import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { RoundTripPage } from './round-trip.page';
import { RoundModalPage } from './round-modal/round-modal.page';

const routes: Routes = [
  {
    path: '',
    component: RoundTripPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RoundTripPage, RoundModalPage],
  entryComponents: [RoundModalPage]
})
export class RoundTripPageModule {}
