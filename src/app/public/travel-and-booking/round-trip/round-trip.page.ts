import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { CalendarModalOptions, CalendarModal, CalendarResult } from 'ion2-calendar';
import { RoundModalPage } from './round-modal/round-modal.page';

@Component({
  selector: 'app-round-trip',
  templateUrl: './round-trip.page.html',
  styleUrls: ['./round-trip.page.scss'],
})
export class RoundTripPage implements OnInit {

  today = Date.now();
  current = new Date();
  future = this.current.setDate(this.current.getDate() + 4);
  monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  FMonth: any;
  FDay: any;
  TMonth: any;
  TDay: any;
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

  constructor(public modalCtrl: ModalController,
              private http: HttpClient) {}

  ngOnInit() {
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
      pickMode: 'range',
      title: ''
    };

    const myCalendar = await this.modalCtrl.create({
      component: CalendarModal,
      componentProps: { options }
    });

    myCalendar.present();

    const event: any = await myCalendar.onDidDismiss();
    const date = event.data;
    console.log(date);
    if (date !== null) {
      const calFMonth = (date.from.months - 1);
      const monthFName = this.monthNames[calFMonth];
      const FromDate = date.from.date + ' ' + monthFName;
      const fd = new Date(date.from.string);
      const dayFName = this.days[fd.getDay()];
      this.FMonth = FromDate;
      this.FDay = dayFName;

      const calTMonth = (date.to.months - 1);
      const monthTName = this.monthNames[calTMonth];
      const ToDate = date.to.date + ' ' + monthTName;
      const td = new Date(date.to.string);
      const dayTName = this.days[td.getDay()];
      this.TMonth = ToDate;
      this.TDay = dayTName;

      this.isMonthEmpty = false;
    } else {
      this.isMonthEmpty = true;
    }

  }

  async openAirList() {
    this.getAirportList();

    const modal = await this.modalCtrl.create({
      component: RoundModalPage,
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
      component: RoundModalPage,
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

  async travelTypes() {
    const modal = await this.modalCtrl.create({
      component: RoundModalPage,
      componentProps: {
        dType: 'traveler',
        cType: this.cabinData,
        ccType: this.countData,
        pType: this.passDetail
      }
    });
    modal.onWillDismiss().then(dataReturned => {
      const travelData = dataReturned.data;
      if (travelData !== undefined) {
        this.cabinData = travelData.cabin;
        this.countData = travelData.count;
        this.passDetail = travelData.detail;
        this.isTravelerEmpty = false;
      } else {
        this.isTravelerEmpty = true;
      }
    });
    return await modal.present().then(_ => {});
  }


}
