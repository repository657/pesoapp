import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ProductsService } from 'src/app/_services/products.service';
import { first } from 'rxjs/operators';
import { ResponseDescription } from 'src/app/_helpers/response';
import { WalletService } from 'src/app/_services/wallet.service';

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
  currentUser: any;
  planCodes: any;
  uDetail: any;
  prodItem: any;
  prodBrand: any;
  prodType: string[] = [];
  productArr: any[] = [];
  productCode: any[] = [];
  walletBal: any;

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
              public formBuilder: FormBuilder,
              public authenticationService: AuthenticationService,
              public prod: ProductsService, public resp: ResponseDescription,
              public wallet: WalletService) {

              this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
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

    this.uDetail = this.currentUser.data;
    this.getPlanCodes(this.uDetail);
    this.getWalletBal();
  }

  getPrefixes(item: any) {
    this.prodItem = item;
    this.prod.getProductPrefixes(this.uDetail).pipe(first()).subscribe(
      prefixData => {
        const prefix = prefixData.body;
        this.options = prefix.data;
      },
      error => {
        console.log(error);
    });
    this.getProductType(item);
    this.validationsForm.get('type').enable({onlySelf: false});
    this.validationsForm.get('mobile').enable({onlySelf: false});
    this.validationsForm.get('prefix').enable({onlySelf: false});
  }

  getProductType(tel) {
    tel = tel.toLowerCase();
    this.prodBrand = (tel.includes('smart') ? 'smart' : tel.includes('globe') ? 'globe' : tel.includes('tm') ? 'tm' : 'sun');
    this.prod.getAllPlanCodes(this.uDetail).pipe(first()).subscribe(
      planCodeData => {
        console.log(planCodeData);
        const pcData = planCodeData.body;
        this.productArr = new Array();
        for (const i of pcData.data) {
          if (i.brand.toLowerCase().includes(this.prodBrand) || i.brand.toLowerCase().includes('tnt')) {
            this.productArr.push({
              product: i.keyword,
              denomination: i.wallet_cost,
              package: i.load_package,
              product_type: i.product_type,
            });
            if (!this.prodType.includes(i.product_type)) {
              this.prodType.push(i.product_type);
            }
          }
        } // end for
      },
      async error => {
        console.log(error);
    });
  }

  getProducts(prod: any) {
    console.log(this.productArr);
    this.productCode = new Array();
    for (const y of this.productArr) {
      if (y.product_type === prod) {
        this.productCode.push({
          name: y.package,
          value: y.product,
        });
      }
    }
    this.validationsForm.get('product').enable({onlySelf: false});
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
    const loader = await this.loading.create({
      message: 'Processing please wait…',
      spinner: 'crescent',
      mode: 'md',
    });

    await loader.present().then(async () => {

          this.prod.loadCustomer(this.uDetail, values).pipe(first()).subscribe(
            async loadStatus => {
              console.log(loadStatus);
              loader.dismiss();
              const alert = await this.alertController.create({
                message: 'loading success.',
                buttons: ['close']
              });

              alert.present();
              this.validationsForm.reset();
            },
            async error => {
              console.log(error);
              loader.dismiss();
              const alert = await this.alertController.create({
                message: error,
                buttons: ['close']
              });

              alert.present();
              this.validationsForm.reset();
          });

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

  mobileLength(mob: any) {
    if (mob.length > 6) {
     return false;
    }
  }

}
