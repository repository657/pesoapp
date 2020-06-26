import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EpinPaymentPage } from './epin-payment.page';
import { EpinModalPage } from './epin-modal/epin-modal.page';

const routes: Routes = [
  {
    path: '',
    component: EpinPaymentPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EpinPaymentPage, EpinModalPage],
  entryComponents: [EpinModalPage]
})
export class EpinPaymentPageModule {}
