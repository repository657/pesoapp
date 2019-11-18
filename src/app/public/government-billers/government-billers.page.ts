import { Component, OnInit } from '@angular/core';
import { GovModalPage } from './gov-modal/gov-modal.page';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-government-billers',
  templateUrl: './government-billers.page.html',
  styleUrls: ['./government-billers.page.scss'],
})
export class GovernmentBillersPage implements OnInit {

  constructor(public modalCtrl: ModalController,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController) { }

  ngOnInit() {
  }

  async nextModal() {
    const modal = await this.modalCtrl.create({
      component: GovModalPage,
      componentProps: {

      }
    });
    modal.onWillDismiss().then(async dataReturned => {
      const data = dataReturned.data;
      const loader = await this.loadingCtrl.create({
        message: 'Processing please wait…',
        spinner: 'crescent',
        mode: 'md',
      });

      await loader.present().then(async () => {
            loader.dismiss();
            const alert = await this.alertCtrl.create({
              message: 'payment success.',
              buttons: ['close']
            });

            alert.present();
      }); // end loader.present
    });
    return await modal.present().then(_ => {});
  }

}
