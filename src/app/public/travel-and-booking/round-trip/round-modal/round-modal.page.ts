import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-round-modal',
  templateUrl: './round-modal.page.html',
  styleUrls: ['./round-modal.page.scss'],
})
export class RoundModalPage implements OnInit {

  isItemAvailable = false;

  @Input() public data = [];
  @Input() public dType;
  @Input() public cType;
  @Input() public ccType;
  @Input() public pType;

  items = [];

  cabinList = [
    {title : 'First', checked: 'false'},
    {title : 'Economy', checked: 'true'},
    {title : 'Business', checked: 'false'},
  ];

  travelerList = [
    {id: 0, title: 'Adult', subTitle: '18 - 64', count: 0, greaterThanZero: true},
    {id: 1, title: 'Senior Citizen', subTitle: '65+', count: 0, greaterThanZero: false},
    {id: 2, title: 'Youth', subTitle: '12 - 17', count: 0, greaterThanZero: false},
    {id: 3, title: 'Child', subTitle: '2 - 12', count: 0, greaterThanZero: false},
    {id: 4, title: 'Seat Infant', subTitle: 'Under 2', count: 0, greaterThanZero: false},
    {id: 5, title: 'Lap Infant', subTitle: 'Under 2', count: 0, greaterThanZero: false}
  ];

  countVal;
  cabin;
  passenger = [];

  constructor(private modalController: ModalController,
              private alertController: AlertController,
              private http: HttpClient) {}

  async closeModal() {
    await this.modalController.dismiss();
  }

  ngOnInit() {
    if (this.dType === 'traveler') {
      if (this.pType.length === 0) {
        this.travelerList[0].title = 'Adult';
        this.travelerList[0].count = 1;
        this.passenger.push('Adult');
      } else {
        for (const i of this.travelerList) {
          for (const j of this.pType) {
            if (i.id === j.id) {
              this.travelerList[j.id].title = j.title;
              this.travelerList[j.id].count = j.count;
              this.passenger.push(j.title);
            }
          }
        }
      }
    }
  } // end ngOnInit();

  initializeItems() {
    this.items = this.data;
  }

  searchAirports(word: any) {

    // set val to the value of the searchbar
    const val = word;

    // if the value is an empty string don't filter the items
    if (val && val.trim() !== '' && val.length > 2) {
      this.initializeItems();
      this.isItemAvailable = true;

      this.items = this.items.filter((item) => {
          return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    } else {
      return this.items = [];
    }
  }

  async getFlight(airport: any) {
    await this.modalController.dismiss(airport);
  }

  async getSearchOption(data: any) {
    const pData = [];
    let totalCount = 0;
    for (const i of data) {
      let pVal = {};
      if (i.count === 1) {
        pVal = {
          id: i.id,
          title: i.title,
          count: i.count,
        };
        pData.push(pVal);
        totalCount = totalCount + i.count;
      }
    }
    const searchData = {
      cabin: this.cabin,
      count: totalCount,
      detail: pData
    };
    await this.modalController.dismiss(searchData);
  }

  onChangeHandler($event) {
    this.cabin = $event.target.value;
  }

  add(index: any) {
    this.passenger.push(this.travelerList[index].title);
    this.travelerList[index].count = this.travelerList[index].count + 1;
    if (this.travelerList[index].count > 0) {
      this.travelerList[index].greaterThanZero = true;
    } else {
      this.travelerList[index].greaterThanZero = false;
    }
  }
  async minus(index: any) {
    const zero = [];
    const val = this.travelerList[index].count - 1;
    for (const a of this.travelerList) {
      if (this.travelerList[index].id === a.id) {
        this.passenger = this.passenger.filter(item => {
          return item !== this.travelerList[index].title;
        });
        zero.push(val);
      } else {
        zero.push(a.count);
      }
    }
    const someIsNotZero = zero.some(item => item > 0);
    if (someIsNotZero !== false) {
      if (this.travelerList[index].count > 0) {
        if (this.passenger.includes('Adult') || this.passenger.includes('Senior Citizen')) {
          this.travelerList[index].count = this.travelerList[index].count - 1;
          this.travelerList[index].greaterThanZero = false;
        } else {
          const alert = await this.alertController.create({
            header: 'ATTENTION',
            subHeader: 'Traveler at least accompanied by an Adult / Senior Citizen',
            buttons: ['OK']
          });
          alert.present();
        }
      }
    } else {
      const alert = await this.alertController.create({
        header: 'ATTENTION',
        subHeader: 'You need at least 1 traveler',
        buttons: ['OK']
      });

      alert.present();
    }
  }

}
