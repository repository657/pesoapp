import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, LoadingController } from '@ionic/angular';
import { DownloadModalPage } from './download-modal/download-modal.page';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { HistoryService } from 'src/app/_services/history.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-report-history',
  templateUrl: './report-history.page.html',
  styleUrls: ['./report-history.page.scss'],
})
export class ReportHistoryPage implements OnInit {
  today = new Date();
  newDate = (this.today.getMonth() + 1) + '-' + this.today.getDate() + '-' +  this.today.getFullYear();
  items = Array.from({length: 10}, (v, k) => k + 1);
  currentUser: any;
  uDetail: any;
  salesHistory: any;
  walletHistory: any;
  isSales = false;
  reportType: any;

  constructor(public modalCtrl: ModalController,
              public alertCtrl: AlertController,
              public auth: AuthenticationService,
              public history: HistoryService) {

                this.auth.currentUser.subscribe(x => this.currentUser = x);
              }

  ngOnInit() {
    this.uDetail = this.currentUser.data;
    this.getHistoryType('sales');
  }

  async showDetails(value) {
    console.log(value);
    let msg = '';
    if (this.reportType === 'sales') {
      msg = '<span class="head-alert"><b>Transaction Ref:</b></span> <span class="body-alert">' + value.transactionid + '</span> </br>' +
      '<span class="head-alert"><b>Date:</b></span> <span class="body-alert">' + value.transactiondate + '</span> </br>' +
      '<span class="head-alert"><b>Type:</b></span> <span class="body-alert">' + value.brand + '</span> </br>' +
      '<span class="head-alert"><b>Amount:</b></span> <span class="body-alert">' + value.amount + '</span> </br>' +
      '<span class="head-alert"><b>Trace Number:</b></span> <span class="body-alert">' + value.topuptrace + '</span> </br>' +
      '<span class="head-alert"><b>Target Number:</b></span> <span class="body-alert">' + value.targetmsisdn + '</span> </br>' +
      '<span class="head-alert"><b>Product Code:</b></span> <span class="body-alert">' + value.productcode + '</span> </br>' ;
    } else {
      msg =
      '<span class="head-alert"><b>Date:</b></span> <span class="body-alert"> ' + value.transdate + '</span></br>' +
      '<span class="head-alert"><b>Type:</b></span> <span class="body-alert"> ' + value.transid + '</span> </br>' +
      '<span class="head-alert"><b>Amount:</b></span> <span class="body-alert"> ' + value.amount + '</span> </br>' +
      '<span class="head-alert"><b>Sender:</b></span> <span class="body-alert"> ' + value.sender + '</span> </br>' +
      '<span class="head-alert"><b>Sender Start Bal:</b></span> <span class="body-alert"> ' + value.sender_start_bal + '</span> </br>' +
      '<span class="head-alert"><b>Sender End Bal:</b></span> <span class="body-alert"> ' + value.sender_end_bal + '</span> </br>' +
      '<span class="head-alert"><b>Receiver:</b></span> <span class="body-alert"> ' + value.receiver + '</span> </br>' +
      '<span class="head-alert"><b>Receiver Start Bal:</b></span> <span class="body-alert"> ' + value.receiver_start_bal + '</span> </br>' +
      '<span class="head-alert"><b>Receiver End Bal:</b></span> <span class="body-alert"> ' + value.receiver_end_bal + '</span> </br>' ;
    }
    const alert = await this.alertCtrl.create({
      message: msg,
      buttons: ['CLOSE'],
      cssClass: 'alertCustomCss'
    });

    alert.present();
  }

  getHistoryType(type: any) {
    console.log(type);
    this.reportType = type;
    if (type === 'sales') {
      this.history.getSalesHistory(this.uDetail, this.today).pipe(first()).subscribe(
        salesData => {
          const sales = salesData.body;
          this.salesHistory = sales.data;
          this.isSales = true;
        },
        error => {
          console.log(error);
      });
    } else {
      this.history.getWalletHistory(this.uDetail).pipe(first()).subscribe(
        salesData => {
          const sales = salesData.body;
          this.salesHistory = sales.data;
          this.isSales = false;
        },
        error => {
          console.log(error);
      });
    }
  }

  async downloadFile() {
    const modal = await this.modalCtrl.create({
      component: DownloadModalPage,
      componentProps: {

      }
    });
    modal.onWillDismiss().then(async dataReturned => {

    });
    return await modal.present().then(_ => {});
  }


}
