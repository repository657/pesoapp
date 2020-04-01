import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GamingPinsPage } from './gaming-pins.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { PinsModalPage } from './pins-modal/pins-modal.page';

const routes: Routes = [
  {
    path: '',
    component: GamingPinsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    IonicSelectableModule,
    ReactiveFormsModule
  ],
  declarations: [GamingPinsPage, PinsModalPage],
  entryComponents: [PinsModalPage]
})
export class GamingPinsPageModule {}
