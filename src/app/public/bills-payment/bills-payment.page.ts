import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-bills-payment',
  templateUrl: './bills-payment.page.html',
  styleUrls: ['./bills-payment.page.scss'],
})
export class BillsPaymentPage implements OnInit {

  validationsForm: FormGroup;

  validationMessages = {
    category: [
      { type: 'required', message: 'category field should not be empty.' }
    ],
    brand: [
      { type: 'required', message: 'brand field should not be empty'}
    ],
    ref: [
      { type: 'required', message: 'account field should not be empty.'},
      { type: 'pattern', message: 'account/reference number should be numeric.' }
    ],
    amount: [
      { type: 'required', message: 'amount field should not be empty'},
      { type: 'pattern', message: 'amount should be numeric.' }
    ]
  };

  constructor(public formBuilder: FormBuilder,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController) { }

  ngOnInit() {
    this.validationsForm = this.formBuilder.group({
      category: new FormControl('', Validators.compose([
        Validators.required
      ])),
      brand: new FormControl('', Validators.compose([
        Validators.required
      ])),
      ref: new FormControl('', Validators.compose([
        Validators.pattern('^(0|[1-9][0-9]*)$'),
        Validators.required
      ])),
      amount: new FormControl('', Validators.compose([
        Validators.pattern('^(0|[1-9][0-9]*)$'),
        Validators.required
      ])),
    });
  }

  async onSubmit(value) {
    console.log(value);
    const loader = await this.loadingCtrl.create({
      message: 'Processing please wait…',
      spinner: 'crescent',
      mode: 'md',
    });

    await loader.present().then(async () => {
          loader.dismiss();
          const alert = await this.alertCtrl.create({
            message: 'payment success.',
            buttons: ['close']
          });

          alert.present();
          this.validationsForm.reset();
    }); // end loader.present
  }

}
