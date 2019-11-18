import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GovernmentBillersPage } from './government-billers.page';
import { GovModalPage } from './gov-modal/gov-modal.page';
const routes: Routes = [
  {
    path: '',
    component: GovernmentBillersPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GovernmentBillersPage, GovModalPage],
  entryComponents: [GovModalPage]
})
export class GovernmentBillersPageModule {}
