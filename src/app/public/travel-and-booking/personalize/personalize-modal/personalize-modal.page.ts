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
  foodPriceA = [];
  foodPriceB = [];
  totalFoodPrice = [];
  premium = 349.00;
  standardP = 246.4;
  standard = 201.6;

  name = [];
  weightName = [];
  foodNameA = [];
  foodNameB = [];

  @Input() public Type;
  @Input() public From;
  @Input() public To;
  @Input() public Travel;
  @Input() public Pass = [];

  items = [];

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

  constructor(private modalController: ModalController) {
  }

  ngOnInit() {
    this.initializeItems();
    const result = this.items.length;
    let resLength = 0;
    if (result % 3 === 0) {
      resLength = (result / 3);
    } else {
        const x = Math.floor(result / 3);
        resLength = x + 1;
    }
    this.SlideLength = Array.from({length: 40}, (v, k) => k + 1);
    for (const i of this.items) {
      this.passList.push(i);
      this.price.push(0);
      this.foodPriceA.push(0);
      this.foodPriceB.push(0);
      this.totalFoodPrice.push(0);
    }
  }

  initializeItems() {
    this.items = this.Pass;
  }

  async closeModal() {
    await this.modalController.dismiss();
  }

  getWeight(index: any) {
    const split = this.weight[index].split('-');
    this.price[index] = split[1];
    this.weightName[index] = split[0];
    if (!this.name.includes(this.passList[index].name)) {
      this.name.push(this.passList[index].name);
    }
  }

  getFoodA(index: any) {
    const split = this.FoodA[index].split('-');
    this.foodPriceA[index] = split[1];
    this.foodNameA[index] = split[0];
    this.totalFoodPrice[index] = parseFloat(this.foodPriceA[index]) + parseFloat(this.foodPriceB[index]);
    if (!this.name.includes(this.passList[index].name)) {
      this.name.push(this.passList[index].name);
    }
  }

  getFoodB(index: any) {
    const split = this.FoodB[index].split('-');
    this.foodPriceB[index] = split[1];
    this.foodNameB[index] = split[0];
    this.totalFoodPrice[index] = parseFloat(this.foodPriceB[index]) + parseFloat(this.foodPriceA[index]);
    if (!this.name.includes(this.passList[index].name)) {
      this.name.push(this.passList[index].name);
    }
  }

  async proceed(type: any) {
    if (type === 'bag') {
      const bagData = [];
      for (let i = 0; i < this.weight.length; i++) {
        const b = {
          name: this.name[i],
          weight: this.weightName[i],
          price: this.price[i]
        };
        bagData.push(b);
      }
      await this.modalController.dismiss(bagData);
    } else {
      const foodData = [];
      for (let j = 0; j < this.FoodA.length; j++) {
        const f = {
          name: this.name[j],
          food: [this.foodNameA[j], this.foodNameB[j]],
          price: this.totalFoodPrice[j]
        };
        foodData.push(f);
      }
      await this.modalController.dismiss(foodData);
    }
  }

}
