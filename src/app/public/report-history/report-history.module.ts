import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ReportHistoryPage } from './report-history.page';
import { DownloadModalPage } from './download-modal/download-modal.page';

const routes: Routes = [
  {
    path: '',
    component: ReportHistoryPage
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
  declarations: [ReportHistoryPage, DownloadModalPage],
  entryComponents: [DownloadModalPage]
})
export class ReportHistoryPageModule {}
