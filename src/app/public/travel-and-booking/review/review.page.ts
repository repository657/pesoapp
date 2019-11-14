import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-review',
  templateUrl: './review.page.html',
  styleUrls: ['./review.page.scss'],
})
export class ReviewPage implements OnInit {

  sub: any;
  Details: any;
  fDetails: any;
  pDetails: any;
  aDetails: any;

  fromI: any;
  toI: any;
  type: any;
  cabin: any;
  persons: any;

  tList = [];
  size: any;
  bagSize: any;
  foodSize: any;

  totalBagPrice = 0;
  totalFoodPrice = 0;
  totalAddOnsPrice = 0;

  constructor(public modalCtrl: ModalController,
              public route: ActivatedRoute,
              public loading: LoadingController,
              public router: Router,
              private toastCtrl: ToastController) {

    this.sub = this.route.params.subscribe(params => {
      this.fDetails = JSON.parse(params.travel); console.log(this.fDetails);
      this.pDetails = JSON.parse(params.passenger);
      this.aDetails = JSON.parse(params.addOns);
    });
}

  ngOnInit() {
    // get flight Details
      const parseFlight = JSON.parse(this.fDetails.flight);
      const fRes = parseFlight.from.split('(');
      const tRes = parseFlight.to.split('(');
      this.fromI = fRes[1].replace(')', '');
      this.toI = tRes[1].replace(')', '');
      const tCabin = JSON.parse(parseFlight.traveler);
      this.cabin = tCabin.cabin;
      this.persons = tCabin.count;
      this.type = parseFlight.type;

      if (this.type === 'one-way') {
        this.size = 12;
        this.tList = [{ from: this.fromI, to: this.toI, icon: 'airplane', class: 'ion-rotate-90' }];
      } else {
        this.size = 6;
        this.tList = [{ from: this.fromI, to: this.toI, icon: 'airplane', class: 'ion-rotate-90' },
        { from: this.toI, to: this.fromI, icon: 'airplane', class: 'ion-rotate-270' }];
      }

      // get addOn details
      this.bagSize = this.aDetails.bagDetails.length;
      this.foodSize = this.aDetails.foodDetails.length;
      for (let i = 0; i < this.bagSize; i++) {
        this.totalBagPrice = this.totalBagPrice + Number(this.aDetails.bagDetails[i].price);
      }
      for (let i = 0; i < this.foodSize; i++) {
        this.totalFoodPrice = this.totalFoodPrice + Number(this.aDetails.foodDetails[i].price);
      }
      this.totalAddOnsPrice = this.totalBagPrice + this.totalFoodPrice;
  }

  async submit() {
    const toast = await this.toastCtrl.create({
      message: 'Flight successfully booked.',
      duration: 3000,
      position: 'top',
      showCloseButton: true
    });

    await toast.present().then(() => {
      toast.dismiss();
      this.router.navigate(['home']);
    });

  }

}
