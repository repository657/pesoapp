import { Component, OnInit, NgZone, ElementRef, ViewChild, SystemJsNgModuleLoader, AfterViewInit } from '@angular/core';
import { CalendarComponentOptions, CalendarModalOptions, CalendarModal, CalendarResult } from 'ion2-calendar';
import { ModalController, IonSlides, LoadingController, AlertController } from '@ionic/angular';
import { ModalsPage } from './modals/modals.page';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { WalletService } from 'src/app/_services/wallet.service';
import { first } from 'rxjs/internal/operators/first';


@Component({
  selector: 'app-one-way',
  templateUrl: './one-way.page.html',
  styleUrls: ['./one-way.page.scss'],
})
export class OneWayPage implements OnInit {
  today = Date.now();
  monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  labelMonth: any;
  labelDay: any;
  date: any;
  isMonthEmpty = true;
  isFlyingFromEmpty = true;
  isFlyingToEmpty = true;
  isTravelerEmpty = true;

  airport = [];

  fromResult: string;
  iata: string;
  toResult: any;
  iata2: string;

  cabinData = 'Economy';
  countData = 1;
  passengerData = 'Adult';
  passDetail = [];
  travelData: any;

  showFooter = false;

  walletBal: any;
  currentUser: any;
  uDetail: any;
  expiration: any;

  constructor(public modalCtrl: ModalController,
              private http: HttpClient,
              private router: Router,
              public loading: LoadingController,
              private auth: AuthenticationService, public wallet: WalletService,
              private alertController: AlertController) {
              }

  ngOnInit() {}

  ionViewDidEnter() {
    // alert(this.uid.IMEI);
    this.auth.currentUser.subscribe(x => this.currentUser = x);
    this.uDetail = this.currentUser.data;
    this.expiration = this.auth.isExpired();
    if (this.expiration === true) {
      this.getWalletBal();
    } else {
      this.SessionExpired();
    }
  }

  async gotoFlightSearch() {
    if (this.fromResult === undefined) {
      const alert = await this.alertController.create({
        header: 'ATTENTION',
        message: 'Please enter your origin',
        mode: 'ios',
        buttons: ['OK']
      });
      alert.present();
    } else if (this.toResult === undefined) {
      const alert = await this.alertController.create({
        header: 'ATTENTION',
        message: 'Please enter your destination',
        mode: 'ios',
        buttons: ['OK']
      });
      alert.present();
    } else {
      const loader = await this.loading.create({
        spinner: 'crescent',
        cssClass: 'custom-loading',
        translucent: true,
        showBackdrop: true,
        mode: 'md',
        keyboardClose: true
      });

      await loader.present().then(() => {
        loader.dismiss();
        const tData = {
          cabin: this.cabinData,
          count: this.countData,
          detail: [{id: 0, title: this.passengerData, count: this.countData}]
        };
        const details = {
          from: this.fromResult,
          to: this.toResult,
          when: (this.date === undefined ? this.today : this.date),
          traveler: (this.travelData === undefined ? JSON.stringify(tData) : JSON.stringify(this.travelData)),
          type: 'one-way'
        };
        this.router.navigate(['flight', details]);
      }); // end loader.present
    }

  }

  getAirportList() {
    this.airport = [];
    this.http.get('assets/data/airport.json').subscribe(data => {
      const items = data['airports'.toString()];
      for (const i of items) {
        this.airport.push(i.city + ' City, ' + i.country + ' - ' + i.name + '(' + i.IATA + ')');
      }
    });
  }

  async range() {
    const options: CalendarModalOptions = {
      title: ''
    };

    const myCalendar = await this.modalCtrl.create({
      component: CalendarModal,
      componentProps: { options }
    });

    myCalendar.present();

    const event: any = await myCalendar.onDidDismiss();
    this.date = event.data;
    if (this.date !== null) {
      const calMonth = (this.date.months - 1);
      const monthName = this.monthNames[calMonth];
      const travelDate = this.date.date + ' ' + monthName;
      const d = new Date(this.date.string);
      const dayName = this.days[d.getDay()];
      this.labelMonth = travelDate;
      this.isMonthEmpty = false;
      this.labelDay = dayName;
    } else {
      this.isMonthEmpty = true;
    }

  }

  async openAirList() {
    this.getAirportList();

    const modal = await this.modalCtrl.create({
      component: ModalsPage,
      componentProps: {
        data: this.airport,
        dType: 'from'
      }
    });
    modal.onWillDismiss().then(dataReturned => {
      this.fromResult = dataReturned.data;
      if (this.fromResult !== undefined) {
        const res = this.fromResult.split('(');
        this.iata = res[1].replace(')', '');
        this.isFlyingFromEmpty = false;
      } else {
        this.isFlyingFromEmpty = true;
      }
    });
    return await modal.present().then(_ => {});
  }

  async openAirList2() {
    this.getAirportList();

    const modal = await this.modalCtrl.create({
      component: ModalsPage,
      componentProps: {
        data: this.airport,
        dType: 'to'
      }
    });
    modal.onWillDismiss().then(dataReturned => {
      this.toResult = dataReturned.data;
      if (this.toResult !== undefined) {
        const res = this.toResult.split('(');
        this.iata2 = res[1].replace(')', '');
        this.isFlyingToEmpty = false;
      } else {
        this.isFlyingToEmpty = true;
      }
    });
    return await modal.present().then(_ => {});
  }

  swapVal(from: any, to: any, iaFrom: any, iaTo: any) {
    if (this.fromResult !== undefined && this.toResult !== undefined) {
      this.fromResult = to;
      this.toResult = from;
      this.iata = iaTo;
      this.iata2 = iaFrom;
    }
  }

  async travelTypes(value) {
    const modal = await this.modalCtrl.create({
      component: ModalsPage,
      componentProps: {
        dType: 'traveler',
        cType: this.cabinData,
        ccType: this.countData,
        pType: this.passDetail
      }
    });
    modal.onWillDismiss().then(dataReturned => {
      this.travelData = dataReturned.data;
      if (this.travelData !== undefined) {
        this.cabinData = this.travelData.cabin;
        this.countData = this.travelData.count;
        this.passDetail = this.travelData.detail;
        this.isTravelerEmpty = false;
      } else {
        this.isTravelerEmpty = true;
      }
    });
    return await modal.present().then(_ => {});
  }

  backMenu() {
    this.router.navigate(['home']);
  }

  getWalletBal() {
    this.wallet.getWallet(this.uDetail).pipe(first()).subscribe(
      walletData => {
        const balance = walletData.body;
        for (const z of balance.data) {
          this.walletBal = z.wallet;
        }
      },
      error => {
        console.log(error);
    });
  }

  async SessionExpired() {
    const alert = await this.alertController.create({
      message: 'Session expired please login.',
      buttons: ['OK']
    });

    alert.present();
    await this.modalCtrl.dismiss();
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
