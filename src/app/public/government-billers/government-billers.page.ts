import { Component, OnInit } from '@angular/core';
import { GovModalPage } from './gov-modal/gov-modal.page';
import { ModalController, LoadingController, AlertController } from '@ionic/angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { WalletService } from 'src/app/_services/wallet.service';
import { first } from 'rxjs/internal/operators/first';
import { AppState } from 'src/app/_helpers/app.global';

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

  walletBal: any;
  currentUser: any;
  uDetail: any;
  expiration: any;
  selectedTheme: any;

  constructor(public modalCtrl: ModalController,
              public loadingCtrl: LoadingController,
              private auth: AuthenticationService, public wallet: WalletService,
              private alertController: AlertController,
              public formBuilder: FormBuilder,
              public router: Router,
              public settings: AppState) {
                this.settings.getActiveTheme().subscribe(val => this.selectedTheme = val);
              }

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

  ionViewDidEnter() {
    // alert(this.uid.IMEI);
    this.auth.currentUser.subscribe(x => this.currentUser = x);
    this.uDetail = this.currentUser.data;
    this.expiration = this.auth.isExpired();
    if (this.expiration === true) {
      this.getWalletBal();
    } else {
      this.SessionExpired();
    }
  }

  async nextModal(value) {
    const modal = await this.modalCtrl.create({
      component: GovModalPage,
      componentProps: {
        detail: value
      },
      cssClass: this.selectedTheme,
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
              const alert = await this.alertController.create({
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

  getWalletBal() {
    this.wallet.getWallet(this.uDetail).pipe(first()).subscribe(
      walletData => {
        const balance = walletData.body;
        for (const z of balance.data) {
          this.walletBal = z.wallet;
        }
      },
      error => {
        console.log(error);
    });
  }

  async SessionExpired() {
    const alert = await this.alertController.create({
      message: 'Session expired please login.',
      buttons: ['OK']
    });

    alert.present();
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

}
