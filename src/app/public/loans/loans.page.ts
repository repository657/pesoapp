import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { WalletService } from 'src/app/_services/wallet.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/internal/operators/first';

@Component({
  selector: 'app-loans',
  templateUrl: './loans.page.html',
  styleUrls: ['./loans.page.scss'],
})
export class LoansPage implements OnInit {

  installmentFee = 0;
  range = 0;

  creditList = [
    {name: 'Home Credit'}, {name: 'Cashalo'}, {name: 'Loan Ranger'}
  ];

  rangeList = [
    {name: '1 Month', value: '1'}, {name: '2 Months', value: '2'}, {name: '3 Months', value: '3'},
    {name: '6 Months', value: '6'}, {name: '12 Months', value: '12'}
  ];

  validationsForm: FormGroup;

  validationMessages = {
    credit: [{ type: 'required', message: 'credit field should not be empty.' }],
    range: [{ type: 'required', message: 'range field should not be empty'}],
    amount: [{ type: 'required', message: 'amount field should not be empty.'},
             { type: 'pattern', message: 'please input numeric values only.'}]
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
      credit: new FormControl('', Validators.compose([Validators.required])),
      range: new FormControl('', Validators.compose([Validators.required])),
      amount: new FormControl('', Validators.compose([
        Validators.pattern('^(0|[1-9][0-9]*)$'),
        Validators.required
      ]))
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

  getMonthly(event) {
    this.range = event.value.value;
  }

  computeInstallment(value) {
    this.installmentFee = Number(value) / Number(this.range);
  }

  async onSubmit(value) {
    const loader = await this.loadingCtrl.create({
      message: 'Processing please wait…',
      spinner: 'crescent',
      mode: 'md',
    });

    await loader.present().then(async () => {
      loader.dismiss();
      const alert = await this.alertController.create({
        message: 'Loan Successful.',
        buttons: ['CLOSE']
      });
      alert.present();
      this.validationsForm.reset();
    });
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
