import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TouchSequence } from 'selenium-webdriver';

@Component({
  selector: 'app-personalize-modal',
  templateUrl: './personalize-modal.page.html',
  styleUrls: ['./personalize-modal.page.scss'],
})
export class PersonalizeModalPage implements OnInit {

  weight = [[]];
  FoodA = [[]];
  FoodB = [[]];
  price = [];
  totalFoodPrice = [];
  weightPrice = [[]];
  foodPriceA = [[]];
  foodPriceB = [[]];
  FPA = [];
  FPB = [];
  premium = 349.00;
  standardP = 246.4;
  standard = 201.6;
  f: any;
  t: any;

  name = [];
  weightName = [[]];
  foodNameA = [[]];
  foodNameB = [[]];

  @Input() public Type;
  @Input() public From;
  @Input() public To;
  @Input() public Travel;
  @Input() public Flight;
  @Input() public Pass = [];

  items = [];
  FlightItems: any;

  SlideLength: any;

  weightList = [
    {value: '10', name: 'Kg', price: '300'},
    {value: '15', name: 'Kg', price: '350'},
    {value: '20', name: 'Kg', price: '400'},
  ];

  foodList = [
    {meal: 'Spaghetti', price: '300'}, {meal: 'Yakisoba', price: '300'}, {meal: 'Veggie Sandwich', price: '200'},
    {meal: 'Tuna Sandwich', price: '200'}, {meal: 'Roasted Chicken Sandwich', price: '200'}
  ];

  passList = [];
  flightList = [];
  destinationList = [];
  typeList = [];

  constructor(private modalController: ModalController) {
  }

  ngOnInit() {
    this.initializeItems();
    for (const i of this.items) {
      this.passList.push(i);
      this.price.push(0);
      this.totalFoodPrice.push(0);
      this.FPA.push(0);
      this.FPB.push(0);
    }
    // get flight type
    if (this.FlightItems === 'one-way') {
      this.flightList = [0];
      this.destinationList = [this.f + ' - ' + this.t];
      this.typeList = ['Departure'];
    } else {
      this.flightList = [0, 1];
      this.destinationList = [this.f + ' - ' + this.t, this.t + ' - ' + this.f];
      this.typeList = ['Departure', 'Arrival'];
    }

    this.weight = new Array(this.flightList.length).fill('');
    this.weightPrice = new Array(this.flightList.length).fill(0);
    this.weightName = new Array(this.flightList.length).fill('');
    this.FoodA = new Array(this.flightList.length).fill('');
    this.FoodB = new Array(this.flightList.length).fill('');
    this.foodPriceA = new Array(this.flightList.length).fill(0);
    this.foodPriceB = new Array(this.flightList.length).fill(0);
    this.foodNameA = new Array(this.flightList.length).fill('');
    this.foodNameB = new Array(this.flightList.length).fill('');
    for (let j = 0; j < this.flightList.length; j++) {
      this.weight[j] = new Array(this.flightList.length).fill('');
      this.weightPrice[j] = new Array(this.flightList.length).fill(0);
      this.weightName[j] = new Array(this.flightList.length).fill('');
      this.FoodA[j] = new Array(this.flightList.length).fill('');
      this.FoodB[j] = new Array(this.flightList.length).fill('');
      this.foodPriceA[j] = new Array(this.flightList.length).fill(0);
      this.foodPriceB[j] = new Array(this.flightList.length).fill(0);
      this.foodNameA[j] = new Array(this.flightList.length).fill('');
      this.foodNameB[j] = new Array(this.flightList.length).fill('');
    }
  }

  initializeItems() {
    this.items = this.Pass;
    this.FlightItems = this.Flight;
    this.f = this.From;
    this.t = this.To;
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  getWeight(index: any, index2: any) {
    const split = this.weight[index][index2].split('-');
    this.weightPrice[index][index2] = split[1];
    this.weightName[index][index2] = split[0];
    if (!this.name.includes(this.passList[index].name)) {
      this.name.push(this.passList[index].name);
    }
    this.price[index] = 0;
    for (const x of this.weightPrice[index]) {
      this.price[index] += Number(x);
    }
  }

  getFoodA(index: any, index2: any) {
    const split = this.FoodA[index][index2].split('-');
    this.foodPriceA[index][index2] = split[1];
    this.foodNameA[index][index2] = split[0];
    if (!this.name.includes(this.passList[index].name)) {
      this.name.push(this.passList[index].name);
    }
    this.FPA[index] = 0;
    for (const x of this.foodPriceA[index]) {
      this.FPA[index] += Number(x);
    }
    this.totalFoodPrice[index] = parseFloat(this.FPA[index]) + parseFloat(this.FPB[index]);
  }

  getFoodB(index: any, index2: any) {
    const split = this.FoodB[index][index2].split('-');
    this.foodPriceB[index][index2] = split[1];
    this.foodNameB[index][index2] = split[0];
    if (!this.name.includes(this.passList[index].name)) {
      this.name.push(this.passList[index].name);
    }
    this.FPB[index] = 0;
    for (const x of this.foodPriceB[index]) {
      this.FPB[index] += Number(x);
    }
    this.totalFoodPrice[index] = parseFloat(this.FPB[index]) + parseFloat(this.FPA[index]);
  }

  async proceed(type: any) {
    if (type === 'bag') {
      const bagData = [];
      for (let i = 0; i < this.weight.length; i++) {
        const bArr = [];
        let des = {};
        let x = 0;
        for (const j of this.weightName[i]) {
          const b = {
            name: this.name[x],
            weight: this.weightName[x][i],
            price: this.weightPrice[x][i],
          };
          x++;
          bArr.push(b);
        }
        des = { destination: this.destinationList[i], data: bArr };
        bagData.push(des);
      }
      await this.modalController.dismiss(bagData);
    } else {
      const foodData = [];
      for (let a = 0; a < this.FoodA.length; a++) {
        const fArr = [];
        let des = {};
        let x = 0;
        for (const b of this.FoodA[a]) {
          const f = {
            name: this.name[x],
            food: [this.foodNameA[x][a], this.foodNameB[x][a]],
            price: this.foodPriceB[x][a]
          };
          x++;
          fArr.push(f);
        }
        des = { destination: this.destinationList[a], data: fArr };
        foodData.push(des);
      }
      console.log(foodData);
      await this.modalController.dismiss(foodData);
    }
  }

  removeAllElements(array, elem) {
    let index = array.indexOf(elem);
    while (index > -1) {
        array.splice(index, 1);
        index = array.indexOf(elem);
    }
}

}
