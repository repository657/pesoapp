import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { IonicSelectableModule } from 'ionic-selectable';
import { PersonalizeModalPage } from './personalize-modal.page';

const routes: Routes = [
  {
    path: '',
    component: PersonalizeModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    IonicSelectableModule
  ],
  declarations: []
})
export class PersonalizeModalPageModule {}
