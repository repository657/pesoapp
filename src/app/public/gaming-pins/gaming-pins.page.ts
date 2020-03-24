import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { ProductsService } from 'src/app/_services/products.service';
import { ResponseDescription } from 'src/app/_helpers/response';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { WalletService } from 'src/app/_services/wallet.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { PinsModalPage } from './pins-modal/pins-modal.page';

@Component({
  selector: 'app-gaming-pins',
  templateUrl: './gaming-pins.page.html',
  styleUrls: ['./gaming-pins.page.scss'],
})
export class GamingPinsPage implements OnInit {

  validationsForm: FormGroup;

  validationMessages = {
    provider: [{ type: 'required', message: 'provider field should not be empty.' }],
    product: [{ type: 'required', message: 'product field should not be empty.' }],
    pins: [{ type: 'required', message: 'pins field should not be empty'}],
    mobile: [{ type: 'required', message: 'mobile field should not be empty'},
             { type: 'minlength', message: 'min number should be at least 7 digits' },
             { type: 'maxlength', message: 'max number should not be over 7 digits ' },
             { type: 'pattern', message: 'Mobile number should contain only numeric' }],
    prefix: [{ type: 'required', message: 'prefix field should not be empty'}]
  };

  providerList = [
    {name: 'Load Central', val: 'Load Central'}
  ];

  currentUser: any;
  uDetail: any;
  walletBal: any;
  planCodes: any;
  provider: any;
  options: any[] = [];
  productCode: any[] = [];
  productArr = [];
  prodType = [];

  isProviderDisabled = true;
  isProductDisabled = true;

  expiration = this.auth.isExpired();

  constructor(public formBuilder: FormBuilder,
              public loadingCtrl: LoadingController,
              public alertController: AlertController,
              public prod: ProductsService, public resp: ResponseDescription,
              public auth: AuthenticationService,
              public wallet: WalletService,
              private router: Router,
              public modalCtrl: ModalController) {
              }

  ngOnInit() {
    this.validationsForm = this.formBuilder.group({
      provider: new FormControl('', Validators.compose([Validators.required])),
      product: new FormControl({value: '', disabled: this.isProviderDisabled}, Validators.required),
      pins: new FormControl({value: '', disabled: this.isProductDisabled}, Validators.required),
      mobile: new FormControl({value: '', disabled: this.isProviderDisabled}, Validators.compose([
        Validators.maxLength(7),
        Validators.minLength(7),
        Validators.pattern('^(0|[1-9][0-9]*)$'),
        Validators.required
      ])),
      prefix: new FormControl({value: '', disabled: this.isProviderDisabled}, Validators.required),
    });
  }

  ionViewDidEnter() {
    // alert(this.uid.IMEI);
    this.auth.currentUser.subscribe(x => this.currentUser = x);
    this.uDetail = this.currentUser.data;
    if (this.expiration === true) {
      this.getWalletBal();
    } else {
      this.SessionExpired();
    }
  }

  getPrefixes(item: any) {
    this.options = [];
    this.prod.getProductPrefixes(this.uDetail).pipe(first()).subscribe(
      prefixData => {
        const prefix = prefixData.body;
        for (const x of prefix.data) {
          const found = this.options.some(el => el.PREFIX === x.PREFIX);
          if (!found) {
            this.options.push(x);
          }
        }
      },
      error => {
        console.log(error);
    });
    this.getProductType(item.val);
    this.validationsForm.get('product').enable({onlySelf: false});
    this.validationsForm.get('mobile').enable({onlySelf: false});
    this.validationsForm.get('prefix').enable({onlySelf: false});
    this.validationsForm.get('pins').reset();
    this.validationsForm.get('product').reset();
  }

  getProductType(tel) {
    tel = tel.toLowerCase();
    this.provider = this.resp.getBrand(tel);
    this.prod.getAllPlanCodes(this.uDetail).pipe(first()).subscribe(
      planCodeData => {
        console.log(planCodeData);
        const pcData = planCodeData.body;
        this.productArr = [];
        this.prodType = [];
        for (const i of pcData.data) {
          if (i.brand.toLowerCase().includes(this.provider)) {
            this.productArr.push({
              product: i.keyword,
              denomination: i.wallet_cost,
              package: i.load_package,
              product_type: i.product_type,
            });
            const found = this.prodType.some(el => el.name === i.product_type);
            if (!found) {
              this.prodType.push({ name: i.product_type });
            }
          }
        } // end for
        this.validationsForm.get('pins').reset();
        this.validationsForm.get('product').reset();
      },
      async error => {
        console.log(error);
    });
  }

  getPins(prod: any) {
    console.log(this.productArr);
    this.productCode = [];
    for (const y of this.productArr) {
      if (y.product_type === prod.name) {
        this.productCode.push({
          name: y.package,
          value: y.product,
        });
      }
    }
    this.validationsForm.get('pins').enable({onlySelf: false});
    this.validationsForm.get('pins').reset();
  }

  getPlanCodes(userDetail: any) {
    this.prod.getAllPlanCodes(userDetail).pipe(first()).subscribe(
      product => {
        console.log(product);
        this.planCodes = product;
      },
      error => {
        console.log(error);
    });
  }

 async onSubmit(values) {
    console.log(values);
    if (this.expiration === true) {
      this.loadPins(values);
    } else {
      // this.SessionExpired();
    }
}

async loadPins(values) {
  const loader = await this.loadingCtrl.create({
    message: 'Processing please wait…',
    spinner: 'crescent',
    mode: 'md',
  });

  await loader.present().then(async () => {
    // this.prod.loadCustomer(this.uDetail, values, 'pins').pipe(first()).subscribe(
    //   async loadStatus => {
    //     console.log(loadStatus);
    //     loader.dismiss();
    //     const alert = await this.alertController.create({
    //       message: 'Load Successful',
    //       buttons: [{
    //         text: 'close',
    //         handler: () => {
    //           this.getWalletBal();
    //         }
    //       }]
    //     });

    //     alert.present();
    //     this.validationsForm.reset();
    //   },
    //   async error => {
    //     console.log(error);
    //     loader.dismiss();
    //     const alert = await this.alertController.create({
    //       message: error,
    //       buttons: [{
    //         text: 'close',
    //         handler: () => {
    //           this.getWalletBal();
    //         }
    //       }]
    //     });

    //     alert.present();
    //     this.validationsForm.reset();
    // });
    loader.dismiss();
    const alert = await this.alertController.create({
            message: 'Load Successful',
            buttons: [{
              text: 'close',
              handler: () => {
                this.getWalletBal();
                this.viewPins('test');
          }
        }]
    });

    alert.present();
    this.validationsForm.reset();
}); // end loader
}

  async viewPins(pins) {
    const modal = await this.modalCtrl.create({
      component: PinsModalPage,
      componentProps: {
        code: pins,
      }
    });
    modal.onWillDismiss().then(async dataReturned => {

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

  mobileLength(mob: any) {
    if (mob.length > 6) {
     return false;
    }
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
