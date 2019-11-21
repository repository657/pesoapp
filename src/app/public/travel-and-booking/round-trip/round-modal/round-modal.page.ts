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
  hasResults = false;
  indexPlace = 0;

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
      this.hasResults = true;
      this.initializeItems();
      this.isItemAvailable = true;

      this.items = this.items.filter((item) => {
          return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
      if (this.items.length === 0) {
        this.hasResults = false;
        return this.items = ['No results found'];
      }
    } else {
      this.hasResults = false;
      return this.items = ['No results found'];
    }
  }

  async getFlight(airport: any) {
    if (airport !== 'No results found') {
      await this.modalController.dismiss(airport);
    }
  }

  async getSearchOption(data: any) {
    const pData = [];
    let totalCount = 0;
    for (const i of data) {
      let pVal = {};
      if (i.count >= 1) {
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
    if (this.passenger.indexOf(this.travelerList[index].title) === -1) {
      this.passenger.push(this.travelerList[index].title);
    }
    this.travelerList[index].count = this.travelerList[index].count + 1;
    console.log(this.passenger);
    if (this.travelerList[index].count > 0) {
      this.travelerList[index].greaterThanZero = true;
    } else {
      this.travelerList[index].greaterThanZero = false;
    }
  }
  async minus(index: any) {
    const cntList = [];
    this.travelerList[index].count = this.travelerList[index].count - 1;
    console.log(this.travelerList[index].title !== 'Adult');
    if (this.travelerList[index].title !== 'Adult') {
      if (this.travelerList[index].title === 'Senior Citizen') {
        if (this.travelerList[index].count < 1) {
          this.passenger = this.passenger.filter(item => {
            return item !== this.travelerList[index].title;
          });
        }
      } else {
        this.passenger = this.passenger.filter(item => {
          return item !== this.travelerList[index].title;
        });
      }
    } else {
      if (this.travelerList[index].count < 1) {
        this.passenger = this.passenger.filter(item => {
          return item !== this.travelerList[index].title;
        });
      }
    }

    for (const cnt of this.travelerList) {
      cntList.push(cnt.count);
    }
    this.travelerList[index].greaterThanZero = true;
    const someIsNotZero = cntList.some(item => item > 0);
    if (someIsNotZero === false) {
      const alert = await this.alertController.create({
        header: 'ATTENTION',
        subHeader: 'You need at least 1 traveler',
        buttons: ['OK']
      });

      alert.present();
      this.passenger.push(this.travelerList[index].title);
      this.travelerList[index].count = this.travelerList[index].count + 1;
      this.travelerList[index].greaterThanZero = false;
    } else if (this.travelerList[index].count < 1) {
      this.travelerList[index].count = 0;
      this.travelerList[index].greaterThanZero = false;
    }

    if (this.passenger.indexOf('Adult') === -1 && this.passenger.indexOf('Senior Citizen') === -1) {
      const alert = await this.alertController.create({
        header: 'ATTENTION',
        subHeader: 'Traveler at least accompanied by an Adult / Senior Citizen',
        buttons: ['OK']
      });
      alert.present();
      this.passenger.push(this.travelerList[index].title);
      this.travelerList[index].count = this.travelerList[index].count + 1;
    }
  }

}
