import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PaymentsPage } from './payments.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { BillModalPage } from './bill-modal/bill-modal.page';

const routes: Routes = [
  {
    path: '',
    component: PaymentsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PaymentsPage, BillModalPage],
  entryComponents: [BillModalPage]
})
export class PaymentsPageModule {}
