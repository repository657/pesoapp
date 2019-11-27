import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, LoadingController } from '@ionic/angular';
import { DownloadModalPage } from './download-modal/download-modal.page';

@Component({
  selector: 'app-report-history',
  templateUrl: './report-history.page.html',
  styleUrls: ['./report-history.page.scss'],
})
export class ReportHistoryPage implements OnInit {
  today = new Date();
  newDate = (this.today.getMonth() + 1) + '-' + this.today.getDate() + '-' +  this.today.getFullYear();
  items = Array.from({length: 10}, (v, k) => k + 1);

  constructor(public modalCtrl: ModalController,
              public alertCtrl: AlertController) { }

  sampleMsg = '<b>Transaction Ref:</b> 1240535 </br>' +
      '<b>Date:</b> ' + this.newDate + '</br>' +
      '<b>Type:</b> Smart Prepaid </br>' +
      '<b>Amount:</b> 25.00 </br>' +
      '<b>Ref No.:</b> 0001-2402550220';

  ngOnInit() {
  }

  async showDetails(value) {
    const alert = await this.alertCtrl.create({
      message: this.sampleMsg,
      buttons: ['CLOSE']
    });

    alert.present();
  }

  async downloadFile() {
    const modal = await this.modalCtrl.create({
      component: DownloadModalPage,
      componentProps: {

      }
    });
    modal.onWillDismiss().then(async dataReturned => {
      const data = dataReturned.data;
      if (data !== undefined) {
        const alert = await this.alertCtrl.create({
            message: 'email sent!.',
            buttons: ['close']
        });

        alert.present();
      }

    });
    return await modal.present().then(_ => {});
  }


}
