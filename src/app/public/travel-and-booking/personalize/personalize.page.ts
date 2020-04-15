import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { PersonalizeModalPage } from './personalize-modal/personalize-modal.page';
import { ActivatedRoute, Router } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { AppState } from 'src/app/_helpers/app.global';

@Component({
  selector: 'app-personalize',
  templateUrl: './personalize.page.html',
  styleUrls: ['./personalize.page.scss'],
})
export class PersonalizePage implements OnInit {

  sub: any;

  fromI: any;
  toI: any;
  type: any;
  name: any;

  fDetails: any;
  pDetails: [];
  Details: any;

  isBag = false;
  isFood = false;
  bagData = [];
  foodData = [];

  tList = [];
  selectedTheme: any;

  constructor(public modalCtrl: ModalController,
              public route: ActivatedRoute,
              public loading: LoadingController,
              public router: Router, private settings: AppState) {

    this.sub = this.route.params.subscribe(params => {
      this.Details = params;
      this.fDetails = JSON.parse(params.travel);
      const parseFlight = JSON.parse(this.fDetails.flight);
      const fRes = parseFlight.from.split('(');
      const tRes = parseFlight.to.split('(');
      this.fromI = fRes[1].replace(')', '');
      this.toI = tRes[1].replace(')', '');
      this.type = parseFlight.type;

      this.pDetails = JSON.parse(params.passenger);
      if (this.type === 'one-way') {
        this.tList = [this.fromI + ' - ' + this.toI];
      } else {
        this.tList = [this.fromI + ' - ' + this.toI, this.toI + ' - ' + this.fromI];
      }
    });
    this.settings.getActiveTheme().subscribe(val => this.selectedTheme = val);
  }

  ngOnInit() {
  }

  async openBaggage() {
    const modal = await this.modalCtrl.create({
      component: PersonalizeModalPage,
      componentProps: {
        Type: 'bag',
        From: this.fromI,
        To: this.toI,
        Pass: this.pDetails,
        Flight: this.type,
      },
      cssClass: this.selectedTheme
    });
    modal.onWillDismiss().then(dataReturned => {
      this.bagData = dataReturned.data;
      console.log(this.bagData);
      if (this.bagData !== undefined) {
        this.isBag = true;
      } else {
        this.isBag = false;
      }
    });
    return await modal.present().then(_ => {});
  }

  async openMeal() {
    const modal = await this.modalCtrl.create({
      component: PersonalizeModalPage,
      componentProps: {
        Type: 'meal',
        From: this.fromI,
        To: this.toI,
        Pass: this.pDetails,
        Flight: this.type,
      },
      cssClass: this.selectedTheme
    });
    modal.onWillDismiss().then(dataReturned => {
      this.foodData = dataReturned.data;
      console.log(this.foodData);
      if (this.foodData !== undefined) {
        this.isFood = true;
      } else {
        this.isFood = false;
      }
    });
    return await modal.present().then(_ => {});
  }

  async proceedToReview() {
    const loader = await this.loading.create({
      spinner: 'crescent',
      cssClass: 'custom-loading',
      translucent: true,
      showBackdrop: true,
      mode: 'md',
      keyboardClose: true
    });

    const personalize = {
      bagDetails: this.bagData,
      foodDetails: this.foodData
    };

    this.Details = {
      travel: JSON.stringify(this.fDetails),
      passenger: JSON.stringify(this.pDetails),
      addOns: JSON.stringify(personalize)
    };

    await loader.present().then(() => {
      loader.dismiss();
      this.router.navigate(['review', this.Details]);
    }); // end loader.present
  }
}
