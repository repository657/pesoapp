import { Component, OnInit } from '@angular/core';
import { GovModalPage } from './gov-modal/gov-modal.page';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-government-billers',
  templateUrl: './government-billers.page.html',
  styleUrls: ['./government-billers.page.scss'],
})
export class GovernmentBillersPage implements OnInit {

  billList = [
    {name: 'BIR'}, {name: 'DFA'}, {name: 'Maritime Industry Authority'}, {name: 'NBI'},
    {name: 'NHMFC'}, {name: 'NSO'}, {name: 'PAG-IBIG'}, {name: 'POEA'}, {name: 'SSS - PRN'},
  ];

  validationsForm: FormGroup;

  validationMessages = {
    bill: [{ type: 'required', message: 'bill field should not be empty.' }],
    ref: [{ type: 'required', message: 'ref field should not be empty.'},
          { type: 'pattern', message: 'please input numeric values only.'}],
    amount: [{ type: 'required', message: 'amount field should not be empty.'},
             { type: 'pattern', message: 'please input numeric values only.'}],
    email: [{ type: 'required', message: 'email field should not be empty.' },
            { type: 'pattern', message: 'Please enter a valid email.'}],
    contact: [{ type: 'required', message: 'contact field should not be empty.' },
              { type: 'pattern', message: 'please input numeric values only.'},
              { type: 'minlength', message: 'contact must be at least 11 digits.' },
              { type: 'maxlength', message: 'contact cannot be more than 11 digits.' }]
  };

  constructor(public modalCtrl: ModalController,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public formBuilder: FormBuilder,
              public router: Router) { }

  ngOnInit() {
    this.validationsForm = this.formBuilder.group({
      bill: new FormControl('', Validators.compose([Validators.required])),
      contact: new FormControl('', Validators.compose([
        Validators.pattern('^(0|[1-9][0-9]*)$'),
        Validators.required,
        Validators.maxLength(11),
        Validators.minLength(11),
      ])),
      ref: new FormControl('', Validators.compose([
        Validators.pattern('^(0|[1-9][0-9]*)$'),
        Validators.required
      ])),
      amount: new FormControl('', Validators.compose([
        Validators.pattern('^(0|[1-9][0-9]*)$'),
        Validators.required
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
    });
  }

  async nextModal(value) {
    const modal = await this.modalCtrl.create({
      component: GovModalPage,
      componentProps: {
        detail: value
      }
    });
    modal.onWillDismiss().then(async dataReturned => {
      const data = dataReturned.data;
      if (data !== undefined) {
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
    });
    return await modal.present().then(_ => {});
  }

}
