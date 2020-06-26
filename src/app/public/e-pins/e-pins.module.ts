import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EPinsPage } from './e-pins.page';
import { EpinModalPage } from 'src/app/public/e-pins/epin-payment/epin-modal/epin-modal.page';

const routes: Routes = [
  {
    path: '',
    component: EPinsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EPinsPage]
})
export class EPinsPageModule {}
