import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-report-history',
  templateUrl: './report-history.page.html',
  styleUrls: ['./report-history.page.scss'],
})
export class ReportHistoryPage implements OnInit {
  today = new Date();
  newDate = (this.today.getMonth() + 1) + '-' + this.today.getDate() + '-' +  this.today.getFullYear();
  items = Array.from({length: 10}, (v, k) => k + 1);

  constructor(public alertCtrl: AlertController) { }

  ngOnInit() {
  }

  async showDetails(value) {
    const alert = await this.alertCtrl.create({
      message: '<b>Transaction Ref:</b> 1240535 </br>' +
      '<b>Date:</b> ' + this.newDate + '</br>' +
      '<b>Amount:</b> +25.00 </br>' +
      '<b>Ref No.:</b> 0001-2402550220',
      buttons: ['close']
    });

    alert.present();
  }

}
