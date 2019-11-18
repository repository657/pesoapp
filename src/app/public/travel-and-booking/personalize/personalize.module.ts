import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PersonalizePage } from './personalize.page';
import { PersonalizeModalPage } from './personalize-modal/personalize-modal.page';
import { IonicSelectableModule } from 'ionic-selectable';
const routes: Routes = [
  {
    path: '',
    component: PersonalizePage
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
  declarations: [PersonalizePage, PersonalizeModalPage],
  entryComponents: [PersonalizeModalPage]
})
export class PersonalizePageModule {}
