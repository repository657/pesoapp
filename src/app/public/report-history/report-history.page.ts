import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController, LoadingController } from '@ionic/angular';
import { DownloadModalPage } from './download-modal/download-modal.page';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { HistoryService } from 'src/app/_services/history.service';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ResponseDescription } from 'src/app/_helpers/response';
import { AppState } from 'src/app/_helpers/app.global';

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
  resultHistory: any;
  isSales = false;
  reportType: any;
  expiration: any;
  selectedTheme: any

  constructor(public modalCtrl: ModalController,
              public alertController: AlertController,
              public auth: AuthenticationService,
              public history: HistoryService,
              public router: Router,
              public resp: ResponseDescription, private settings: AppState) {
                this.settings.getActiveTheme().subscribe(val => this.selectedTheme = val);
              }

  ngOnInit() {}

  ionViewDidEnter() {
    // alert(this.uid.IMEI);
    this.auth.currentUser.subscribe(x => this.currentUser = x);
    this.uDetail = this.currentUser.data;
    this.expiration = this.auth.isExpired();
    if (this.expiration === true) {
      this.getHistoryType('sales');
    } else {
      this.SessionExpired();
    }
  }

  async showDetails(value) {
    console.log(value);
    const msg = this.resp.getMessage(this.reportType, value);

    const alert = await this.alertController.create({
      message: msg,
      buttons: ['CLOSE'],
      cssClass: 'alertCustomCss'
    });

    alert.present();
  }

  async getHistoryType(type: any) {
    console.log(type);
    this.reportType = type;
    if (this.expiration === true) {
      this.getHistory(type, this.uDetail);
    } else {
      this.SessionExpired();
    }
  }

  getHistory(type, details) {
    const formatDate = this.changeDateFormat(new Date());
    if (type === 'sales') {
      this.history.getSalesHistory(details, formatDate, '', '', 'view').pipe(first()).subscribe(
        salesData => {
          const sales = salesData.body;
          this.resultHistory = sales.data;
          this.isSales = true;
        },
        async error => {
          console.log(error);
          const errorCode = Object.keys(error);
          const alert = await this.alertController.create({
            message: this.resp.getDescription(errorCode),
            buttons: ['CLOSE']
          });

          alert.present();
      });
    } else {
      this.history.getWalletHistory(details, formatDate, '', '', 'view').pipe(first()).subscribe(
        walletData => {
          const wallet = walletData.body;
          this.resultHistory = wallet.data;
          this.isSales = false;
        },
        async error => {
          console.log(error);
          const errorCode = Object.keys(error);
          const alert = await this.alertController.create({
            message: this.resp.getDescription(errorCode),
            buttons: ['CLOSE']
          });

          alert.present();
      });
    }
  }

  changeDateFormat(date) {
    const monthNames = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    return '' + year + '-' + monthNames[monthIndex] + '-' + day;
  }

  async downloadFile() {
    const modal = await this.modalCtrl.create({
      component: DownloadModalPage,
      componentProps: {

      },
      cssClass: this.selectedTheme,
    });
    modal.onWillDismiss().then(async dataReturned => {

    });
    return await modal.present().then(_ => {});
  }

  async SessionExpired() {
    const alert = await this.alertController.create({
      message: 'Session expired please login.',
      buttons: ['OK']
    });

    alert.present();
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }


}
