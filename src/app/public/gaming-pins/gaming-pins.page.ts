import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-gaming-pins',
  templateUrl: './gaming-pins.page.html',
  styleUrls: ['./gaming-pins.page.scss'],
})
export class GamingPinsPage implements OnInit {

  productList = [
    {name: 'Mobile Legends Bang Bang'}, {name: 'Ragnarok mobile'}, {name: 'Steam Wallet'},
    {name: 'Cherry Credits'}, {name: 'zGold-MOLPoints'}, {name: 'Garena Shells'}
  ];

  pinList = [
    {name: 'GAMINGPIN-20'}, {name: 'GAMINGPIN-50'}, {name: 'GAMINGPIN-100'},
    {name: 'GAMINGPIN-200'}, {name: 'GAMINGPIN-300'}, {name: 'GAMINGPIN-500'},
    {name: 'GAMINGPIN-1000'}
  ];

  validationsForm: FormGroup;

  validationMessages = {
    product: [{ type: 'required', message: 'product field should not be empty.' }],
    pins: [{ type: 'required', message: 'pins field should not be empty'}],
    amount: [{ type: 'required', message: 'amount field should not be empty.'},
             { type: 'pattern', message: 'please input numeric values only.'}]
  };

  constructor(public formBuilder: FormBuilder,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController) { }

  ngOnInit() {
    this.validationsForm = this.formBuilder.group({
      product: new FormControl('', Validators.compose([Validators.required])),
      pins: new FormControl('', Validators.compose([Validators.required])),
      amount: new FormControl('', Validators.compose([
        Validators.pattern('^(0|[1-9][0-9]*)$'),
        Validators.required
      ]))
    });
  }

 async onSubmit(value) {
    const loader = await this.loadingCtrl.create({
      message: 'Processing please wait…',
      spinner: 'crescent',
      mode: 'md',
    });

    await loader.present().then(async () => {
      loader.dismiss();
      const alert = await this.alertCtrl.create({
        message: 'Load Successful.',
        buttons: ['CLOSE']
      });
      alert.present();
      this.validationsForm.reset();
    });
  }

}
