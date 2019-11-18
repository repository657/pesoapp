import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

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

  validationsForm: FormGroup;

  validationMessages = {
    telco: [
      { type: 'required', message: 'telco field should not be empty.' }
    ],
    type: [
      { type: 'required', message: 'type field should not be empty'}
    ],
    product: [
      { type: 'required', message: 'product field should not be empty.'}
    ],
    mobile: [
      { type: 'required', message: 'mobile field should not be empty'},
      { type: 'minlength', message: 'min number should be at least 7 digits' },
      { type: 'maxlength', message: 'max number should not be over 7 digits ' },
      { type: 'pattern', message: 'Mobile number should contain only numeric' },
    ],
    prefix: [
      { type: 'required', message: 'prefix field should not be empty'}
    ]
  };

  constructor(private http: HttpClient,
              private alertController: AlertController,
              public loading: LoadingController,
              private toastCtrl: ToastController,
              public formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.validationsForm = this.formBuilder.group({
      telco: new FormControl('', Validators.compose([
        Validators.required
      ])),
      type: new FormControl({value: '', disabled: this.isTelDisabled}, Validators.required),
      product: new FormControl({value: '', disabled: this.isTypeDisabled}, Validators.required),
      mobile: new FormControl({value: '', disabled: this.isTelDisabled}, Validators.compose([
        Validators.maxLength(7),
        Validators.minLength(7),
        Validators.pattern('^(0|[1-9][0-9]*)$'),
        Validators.required
      ])),
      prefix: new FormControl({value: '', disabled: this.isTelDisabled}, Validators.required),
    });
  }

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
    this.validationsForm.get('type').enable({onlySelf: false});
    this.validationsForm.get('mobile').enable({onlySelf: false});
    this.validationsForm.get('prefix').enable({onlySelf: false});
  }

  getProducts(prod: any) {
    this.validationsForm.get('product').enable({onlySelf: false});
  }


  async onSubmit(values) {
    const loader = await this.loading.create({
      message: 'Processing please wait…',
      spinner: 'crescent',
      mode: 'md',
    });

    await loader.present().then(async () => {
          loader.dismiss();
          const alert = await this.alertController.create({
            message: 'loading success.',
            buttons: ['close']
          });

          alert.present();
    }); // end loader.present

  }

  mobileLength(mob: any) {
    if (mob.length > 6) {
     return false;
    }
  }

}
