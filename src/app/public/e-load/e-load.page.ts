import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-e-load',
  templateUrl: './e-load.page.html',
  styleUrls: ['./e-load.page.scss'],
})
export class ELoadPage implements OnInit {
  data: any;
  isTelDisabled = true;
  isTypeDisabled = true;
  options: [];
  @ViewChild('tel', {static: false}) tel;
  @ViewChild('type', {static: false}) type;
  @ViewChild('prod', {static: false}) prod;
  @ViewChild('prefix', {static: false}) prefix;
  @ViewChild('mobile', {static: false}) mobile;

  constructor(private http: HttpClient,
              private alertController: AlertController,
              public loading: LoadingController,
              private toastCtrl: ToastController) {
  }

  ngOnInit() {}

  getPrefixes(item: any) {
    this.http.get('assets/data/prefixes.json').subscribe(data => {
      const keyData = Object.keys(data);
      const itemData = Object.values(data);
      for (const itemKey in keyData) {
        if (keyData[itemKey] === item) {
          this.options = itemData[itemKey];
        }
      }
    });
    this.isTelDisabled = false;
  }

  getProducts(prod: any) {
    this.isTypeDisabled = false;
  }


  async submit() {
    if (this.tel.value === '' || this.type.value === '' || this.prod.value === '' || this.prefix.value === '') {
      const alert = await this.toastCtrl.create({
        message: 'Please input required fields.',
        duration: 3000,
        position: 'top',
        showCloseButton: true
      });

      alert.present();
    } else if (this.mobile.value.length < 7 || this.mobile.value === '') {
      const alert = await this.toastCtrl.create({
        message: 'Invalid mobile number.',
        duration: 3000,
        position: 'top',
        showCloseButton: true
      });

      alert.present();
    } else {
      const alert = await this.toastCtrl.create({
        message: 'loading success.',
        duration: 3000,
        position: 'top',
        showCloseButton: true
      });

      alert.present();
    }
  }

  mobileLength(mob: any) {
    if (mob.length > 7) {
     return false;
    }
  }

}
