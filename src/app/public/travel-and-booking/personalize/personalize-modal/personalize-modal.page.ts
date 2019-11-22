import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TouchSequence } from 'selenium-webdriver';

@Component({
  selector: 'app-personalize-modal',
  templateUrl: './personalize-modal.page.html',
  styleUrls: ['./personalize-modal.page.scss'],
})
export class PersonalizeModalPage implements OnInit {

  weight = [];
  FoodA = [];
  FoodB = [];
  price = [];
  totalFoodPrice = [];
  weightPrice = [];
  foodPriceA = [];
  foodPriceB = [];
  FPA = [];
  FPB = [];
  premium = 349.00;
  standardP = 246.4;
  standard = 201.6;
  f: any;
  t: any;

  name = [];
  weightName = [];
  foodNameA = [];
  foodNameB = [];

  @Input() public Type;
  @Input() public From;
  @Input() public To;
  @Input() public Travel;
  @Input() public Flight;
  @Input() public Pass = {};

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
      this.flightList.push(0);
      this.destinationList = [this.f + ' - ' + this.t];
      this.typeList = ['Departure'];
    } else {
      this.flightList = [0, 1];
      this.destinationList = [this.f + ' - ' + this.t, this.t + ' - ' + this.f];
      this.typeList = ['Departure', 'Arrival'];
      for (let i = 0; i < 2; i++) {
        this.weight[i] = ['']; this.weightPrice[i] = [0]; this.weightName[i] = [''];
        this.FoodA[i] = ['']; this.FoodB[i] = ['']; this.foodPriceA[i] = [0];
        this.foodPriceB[i] = [0]; this.foodNameA[i] = ['']; this.foodNameB[i] = [''];
      }
    }
  }

  initializeItems() {
    this.items = this.Pass['properties'.toString()]; console.log(this.items);
    this.FlightItems = this.Flight;
    this.f = this.From;
    this.t = this.To;
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  getWeight(index: any, index2: any) {
    let split: any[]; console.log(this.weight[index]);
    this.price[index] = 0;
    if (this.FlightItems === 'one-way') {
      split = this.weight[index].split('-');
      this.weightPrice[index] = split[1];
      this.weightName[index] = split[0];
      this.price[index] = this.weightPrice[index];
    } else {
      split = this.weight[index][index2].split('-');
      this.weightPrice[index][index2] = split[1];
      this.weightName[index][index2] = split[0];
      for (const x of this.weightPrice[index]) {
        this.price[index] += Number(x);
      }
    }
    if (!this.name.includes(this.passList[index].firstname + ' ' + this.passList[index].lastname)) {
      this.name.push(this.passList[index].firstname + ' ' + this.passList[index].lastname);
    }
  }

  getFoodA(index: any, index2: any) {
    let split: any[];
    this.FPA[index] = 0;
    if (this.FlightItems === 'one-way') {
      split = this.FoodA[index].split('-');
      this.foodPriceA[index] = split[1];
      this.foodNameA[index] = split[0];
      this.FPA[index] = this.foodPriceA[index];
    } else {
      split = this.FoodA[index][index2].split('-');
      this.foodPriceA[index][index2] = split[1];
      this.foodNameA[index][index2] = split[0];
      for (const x of this.foodPriceA[index]) {
        this.FPA[index] += Number(x);
      }
    }
    if (!this.name.includes(this.passList[index].firstname + ' ' + this.passList[index].lastname)) {
      this.name.push(this.passList[index].firstname + ' ' + this.passList[index].lastname);
    }
    this.totalFoodPrice[index] = parseFloat(this.FPA[index]) + parseFloat(this.FPB[index]);
  }

  getFoodB(index: any, index2: any) {
    let split: any[];
    this.FPB[index] = 0;
    if (this.FlightItems === 'one-way') {
      split = this.FoodB[index].split('-');
      this.foodPriceB[index] = split[1];
      this.foodNameB[index] = split[0];
      this.FPB[index] = this.foodPriceB[index];
    } else {
      split = this.FoodB[index][index2].split('-');
      this.foodPriceB[index][index2] = split[1];
      this.foodNameB[index][index2] = split[0];
      for (const x of this.foodPriceB[index]) {
        this.FPB[index] += Number(x);
      }
    }
    if (!this.name.includes(this.passList[index].firstname + ' ' + this.passList[index].lastname)) {
      this.name.push(this.passList[index].firstname + ' ' + this.passList[index].lastname);
    }
    this.totalFoodPrice[index] = parseFloat(this.FPB[index]) + parseFloat(this.FPA[index]);
  }

  async proceed(type: any) {
    if (type === 'bag') {
      const bagData = [];
      for (const i of this.destinationList) {
        const bArr = [];
        let des = {};
        let b = {};
        for (let j = 0; j < this.name.length; j++) {
          if (this.FlightItems === 'one-way') {
            b = {
              name: this.name[j],
              weight: this.weightName[j],
              price:  this.weightPrice[j]
            };
          } else {
            for (let k = 0; k < this.weight.length; k++) {
              b = {
                name: this.name[j],
                weight: this.weightName[j][k],
                price:  this.weightPrice[j][k]
              };
            }
          }
          bArr.push(b);
        }
        des = { destination: i, data: bArr };
        bagData.push(des);
      }
      await this.modalController.dismiss(bagData);
    } else {
      const foodData = [];
      for (const i of this.destinationList) {
        const fArr = [];
        let des = {};
        let f = {};
        for (let j = 0; j < this.name.length; j++) {
          if (this.FlightItems === 'one-way') {
            f = {
              name: this.name[j],
              food: [this.foodNameA[j], this.foodNameB[j]],
              price:  Number(this.foodPriceA[j]) + Number(this.foodPriceB[j])
            };
          } else {
            for (let k = 0; k < this.weight.length; k++) {
              f = {
                name: this.name[j],
                food: [this.foodNameA[j][k], this.foodNameB[j][k]],
                price:  Number(this.foodPriceA[j][k]) + Number(this.foodPriceB[j][k])
              };
            }
          }
          fArr.push(f);
        }
        des = { destination: i, data: fArr };
        foodData.push(des);
      }
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
