import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { WalletService } from 'src/app/_services/wallet.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/internal/operators/first';

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

  walletBal: any;
  currentUser: any;
  uDetail: any;
  expiration: any;

  constructor(public formBuilder: FormBuilder,
              public loadingCtrl: LoadingController,
              private auth: AuthenticationService, public wallet: WalletService,
              private alertController: AlertController, private router: Router) {
              }

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

  async onSubmit(value) {
    console.log(value);
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

  backMenu() {
    this.router.navigate(['home']);
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
