import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ProductsService } from 'src/app/_services/products.service';
import { first } from 'rxjs/operators';
import { ResponseDescription } from 'src/app/_helpers/response';
import { WalletService } from 'src/app/_services/wallet.service';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { File } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-e-load',
  templateUrl: './e-load.page.html',
  styleUrls: ['./e-load.page.scss'],
})
export class ELoadPage implements OnInit {

  data: any;
  isTelDisabled = true;
  isTypeDisabled = true;
  options: any[] = [];
  currentUser: any;
  planCodes: any;
  uDetail: any;
  prodItem: any;
  prodBrand: any;
  prodDesc: any;
  prodValidity: any;
  prodType: any[] = [];
  productArr: any[] = [];
  productCode: any[] = [];
  walletBal: any;
  expiration: any;
  isTelco = true;
  brand: any;
  uniqueTelco: any[] = [];

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
    ],
    aNumber: [
      { type: 'required', message: 'number field should not be empty'}
    ]
  };

  telcoList: any = [
    // {name: 'Smart Prepaid', val: 'Smart Prepaid'}, /*{name: 'Globe Prepaid', val: 'Globe Prepaid'},*/
    // {name: 'Sun Prepaid', val: 'Sun Prepaid'}, {name: 'Talk and Text', val: 'TNT'},
    // {name: 'PLDT', val: 'PLDT'},{name: 'Smart Bro', val: 'Smart Bro'}, {name: 'Cignal', val: 'Cignal'},
    // {name: 'Meralco', val: 'Meralco'}
    /*{name: 'TM Prepaid', val: 'TM Prepaid'}, */
    /*{name: 'Meralco', val: 'Meralco'},*/
  ];

  constructor(private http: HttpClient,
              private alertController: AlertController,
              public loading: LoadingController,
              public formBuilder: FormBuilder,
              public auth: AuthenticationService,
              public prod: ProductsService, public resp: ResponseDescription,
              public wallet: WalletService,
              private router: Router, private file: File) {
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
      aNumber: new FormControl({value: '', disabled: this.isTelco}, Validators.required)
    });
  }

  ionViewDidEnter() {
    // alert(this.uid.IMEI);
    this.auth.currentUser.subscribe(x => this.currentUser = x);
    this.uDetail = this.currentUser.data;
    this.expiration = this.auth.isExpired();
    // this.getWalletBal();
    if (this.expiration === true) {
      this.getWalletBal();
      this.getPlancodes();
    } else {
      this.SessionExpired();
    }
  }

  getPlancodes(){
    this.prod.getAllPlanCodes(this.uDetail).pipe(first()).subscribe(
      planCodeData => {
        const pcData = planCodeData.body;
        this.telcoList = [];
        for(const i of pcData.data){
          const found = this.telcoList.some(el => el.brand === i.brand);
          if(!found){
            if(i.brand !== 'cwiLC'){
              let brandObj = {
                name: i.brand,
                val: i.brand
              };
              // console.log(i.brand);
              this.telcoList.push(brandObj);
            }
          }
        }
        this.uniqueTelco = this.removeDuplicates(this.telcoList, "name");
      });
  }

  checkCategory(type: any){ 
    console.log(type);
    if(type.val.toLowerCase() === 'meralco' || type.val.toLowerCase() === 'cignal' || type.val.toLowerCase() === 'pldt global') {
      this.isTelco = false;
      this.getProductType(type.val);
      this.validationsForm.get('type').enable({onlySelf: false});
      this.validationsForm.get('aNumber').enable({onlySelf: false});
      this.validationsForm.get('mobile').disable({onlySelf: false});
      this.validationsForm.get('prefix').disable({onlySelf: false});
    } else {
      this.isTelco = true;
      this.getPrefixes(type);
    }
  }

  getPrefixes(item: any) {
    console.log(item);
    this.prodItem = (item.val === 'TNT' || item.val === 'Smart Bro' ? 'Smart Prepaid' : item.val);
    this.options = [];
    this.prod.getProductPrefixes(this.uDetail).pipe(first()).subscribe(
      prefixData => {
        const prefix = prefixData.body;
        for (const x of prefix.data) {
          const found = this.options.some(el => el.PREFIX === x.PREFIX);
          if (!found) {
            if (x.brand === this.prodItem) {
              this.options.push(x);
            } else if(this.prodItem === 'PLDT') {
              this.options.push(x);
            }
          }
          
        }
      },
      error => {
        console.log(error);
    });
    this.getProductType(item.val);
    this.validationsForm.get('type').enable({onlySelf: false});
    this.validationsForm.get('mobile').enable({onlySelf: false});
    this.validationsForm.get('prefix').enable({onlySelf: false});
    this.validationsForm.get('aNumber').disable({onlySelf: false});
    this.validationsForm.get('type').reset();
    this.validationsForm.get('product').reset();
  }

  getProductType(tel) {
    console.log(tel);
    tel = tel.toLowerCase();
    this.prodBrand = this.resp.getBrand(tel);
    this.prod.getAllPlanCodes(this.uDetail).pipe(first()).subscribe(
      planCodeData => {
        const pcData = planCodeData.body;
        console.log(pcData);
        this.productArr = [];
        this.prodType = [];
        for (const i of pcData.data) {
          if (i.brand.toLowerCase().includes(this.prodBrand)) {
            const noDup = this.productArr.some(el => el.product === i.keyword);
            // console.log(this.productArr);
            if (!noDup) {
              this.productArr.push({
                product: i.keyword,
                denomination: i.wallet_cost,
                package: i.load_package,
                product_type: i.product_type,
                description: i.description,
                validity: i.validity
              });
            }
            const found = this.prodType.some(el => el.name === i.product_type);
            if (!found) {
              this.prodType.push({ name: i.product_type });
            }
          }
        } // end for
        this.validationsForm.get('type').reset();
        this.validationsForm.get('product').reset();
      },
      async error => {
        console.log(error);
    });
  }

  getProducts(prod: any) {
    this.productCode = [];
    // console.log(this.productArr);
    for (const y of this.productArr) {
      if (y.product_type === prod.name) {
        this.productCode.push({
          name: y.package, 
          value: y.product,
          description: y.description,
          validity: y.validity,
        });
      }
    }
    
    console.log(this.productCode);
    this.validationsForm.get('product').enable({onlySelf: false});
    this.validationsForm.get('product').reset();
  }

  getDescription(keyword) {
    for(const i of this.productCode) {
      if(i.value === keyword.value) {
        console.log(i);
        if(i.validity.indexOf('days') > -1){
          this.prodValidity = i.validity;
        } else {
          this.prodValidity = (i.validity == '' ? '0 day(s)' : i.validity + ' day(s)');
        }
        this.prodDesc = i.description;
      }
    }
  }

  getMessage(isCat: any, values: any){
    let msg = '';
    if(isCat === false) {
      return msg = '<center>please verify the number. <br><br> ' +
      '<b> ' + values.aNumber + '</b></center>';
    } else {
      return msg = '<center>please verify the number. <br><br> ' +
      '<b> ' + values.prefix.PREFIX + values.mobile + '</b></center>';
    }
  }

  async onSubmit(values) {
    if(this.isTelco === false) {
      values.prefix = {
        PREFIX: '', 
      };
    }
    values.type = this.isTelco;
    console.log(values);
    if (this.expiration === true) {
        const alert = await this.alertController.create({
          message: this.getMessage(this.isTelco, values),
          buttons: [{
            text: 'close',
            handler: () => {
              this.getWalletBal();
            }
          },
          {
            text: 'proceed',
            handler: async () => {
              this.LoadCustomer(values);
            }
          }]
        });
        alert.present();
    } else {
      this.SessionExpired();
    }

  }

  async LoadCustomer(values) {
    const loader = await this.loading.create({
      message: 'Processing please wait…',
      spinner: 'crescent',
      mode: 'md',
    });

    await loader.present().then(async () => {
      this.prod.loadCustomer(this.uDetail, values, 'load').pipe(first()).subscribe(
        async loadStatus => {
          console.log(loadStatus);
          loader.dismiss();
          const respStatus = this.resp.statusDescription(loadStatus.body.status);
          const alert2 = await this.alertController.create({
            message: respStatus,
            buttons: [{
              text: 'close',
              handler: () => {
                this.getWalletBal();
              }
            }]
          });
          alert2.present();
          this.validationsForm.reset();
        },
        async error => {
          console.log(error);
          const alert = await this.alertController.create({
            message: error,
            buttons: [{
              text: 'close',
              handler: () => {
                this.getWalletBal();
              }
            }]
          });
          alert.present();
          this.validationsForm.reset();
      });
    }); // end loader.present
  }

  getWalletBal() {
    this.wallet.getWallet(this.uDetail).pipe(first()).subscribe(
      walletData => {
        console.log(walletData);
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

  removeDuplicates(originalArray, prop) {
    var newArray = [];
    var lookupObject  = {};

    for(var i in originalArray) {
       lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for(i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
     return newArray;
}


}
