import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { first } from 'rxjs/operators';
import { ResponseDescription } from 'src/app/_helpers/response';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { EpinsService } from 'src/app/_services/epins.service';
import { LoadingService } from 'src/app/_services/loading.service';
import { WalletService } from 'src/app/_services/wallet.service';

@Component({
  selector: 'app-isp',
  templateUrl: './isp.page.html',
  styleUrls: ['./isp.page.scss'],
})
export class IspPage implements OnInit {

  walletBal: any;
  currentUser: any;
  uDetail: any;
  expiration: any;
  productList = [];

  RadiusForm: FormGroup;
  validationMessages = {
    sku: [
      { type: 'required', message: 'This field is required.' }
    ],
    mobile: [
      { type: 'required', message: 'This field is required'},
      { type: 'minlength', message: 'min number should be at least 11 digits.' },
      { type: 'maxlength', message: 'max number should not be over 11 digits. ' },
    ],
    email: [
      { type: 'required', message: 'This field is required' },
      { type: 'pattern', message: 'Please enter a valid email address.'}
    ],
  };

  isDisabled = true;
  description: any;

  constructor(private loading: LoadingService, private loading2: LoadingController,
    private auth: AuthenticationService, public wallet: WalletService,
    private alertController: AlertController, private router: Router,
    private epin: EpinsService, private fb: FormBuilder,
    private resp: ResponseDescription) { }

  ngOnInit() { 
    this.initilizeForm();
  }

  ionViewDidEnter() {
    this.auth.currentUser.subscribe(x => this.currentUser = x);
    this.uDetail = this.currentUser.data;
    this.expiration = this.auth.isExpired();
    // this.getWalletBal();
    this.showEpinList(true);
    if (this.expiration === true) { 
      this.getWalletBal();
    } else {
      this.SessionExpired();
    }
  }

  async showEpinList(isProd: boolean) { 
    if(isProd){
      this.epin.getEpins(this.uDetail).pipe(first()).subscribe(
        epinData => {
          const details = epinData.body;
          this.productList = [];
          for(const i of details.data){
            if(i.brand.toLowerCase() === 'radius'){
              this.productList.push(i);
            }
          }
          console.log(epinData.body);
        },
        error => {
          console.log(error);
      });
    } else {
      this.productList = [
        {planCode: '50 for 1 day', description: '50 valid for 1 day', denomination: '50.00', list_price: null},
        {planCode: '100 for 7 days', description: '100 valid for 7 days', denomination: '100.00', list_price: null},
        {planCode: '300 for 1 month', description: '300 valid for 1 month', denomination: '300.00', list_price: null},
      ];
    }
  }

  initilizeForm(){
    this.RadiusForm = this.fb.group({
      sku: new FormControl('', Validators.compose([Validators.required])),
      mobile: new FormControl({value: '', disabled: this.isDisabled}, Validators.compose([
        Validators.maxLength(11),
        Validators.minLength(11),
        Validators.required
      ])),
      email: new FormControl({value: '', disabled: this.isDisabled}, Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
    });
  }

  async onSubmit(values) {
    let planCode = values.sku.planCode;
    let mobile = values.mobile;
    let email = values.email;
    let dataObj = {
      planCode: planCode,
      targetSubsAccount: mobile,
      email: email,
    }
    var regExp = /^0[0-9].*$/
    if(regExp.test(mobile)){
      //for demo purposes no call in API;
      // let voucher = this.generateCode();
      // values.voucher = voucher;
      const alert = await this.alertController.create({
        message: this.getMessage(mobile),
        buttons: [{
          text: 'close',
          handler: () => {
            this.getWalletBal();
          }
        },
        {
          text: 'proceed',
          handler: async () => {
            this.DispenseEpins(dataObj);
          }
        }]
      });
      alert.present();
      this.RadiusForm.reset();
    }else {
      this.showErrorAlert('mobile number should start with 0');
    }
  }

  async DispenseEpins(data){
    console.log(data);
    const loader = await this.loading2.create({
      message: 'Processing please wait…',
      spinner: 'crescent',
      mode: 'md',
    });

    await loader.present().then(async () => {
      this.epin.dispenseEpins(this.uDetail, data).pipe(first()).subscribe(
        async res => {
          loader.dismiss();
          console.log(res)
          let msg = this.resp.viewVoucher(res.data.epin);
          const alert2 = await this.alertController.create({
            message: "You have successfully purchased "+data.planCode,
            buttons: [{
              text: 'view voucher',
              handler: () => {
                this.getWalletBal();
                this.showErrorAlert(msg);
              }
            }]
          });
          alert2.present();
          this.RadiusForm.reset();
        }
      )
    }); //end loader present
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

  toggleMobile(event){
    let data = event.value;

    this.description = 'Plan Code: '+data.planCode+ '\r\n' +
    'Product Description: '+data.description+ '\r\n' +
    'Denomination: '+data.denomination+ '\r\n';
    // 'List Price: '+data.list_price+ '\r\n';

    this.RadiusForm.get('mobile').enable({onlySelf: false});
    this.RadiusForm.get('email').enable({onlySelf: false});
  }

  mobileLength(mob: any) {
    if (mob.length > 10) {
     return false;
    }
  }

  async showErrorAlert(msg){
    const alert = await this.alertController.create({
      message: msg,
      buttons: [{
        text: 'close',
        handler: () => {
          this.getWalletBal();
        }
      }]
    });
    alert.present();
    this.RadiusForm.reset();
  }

  getMessage(mobile: any){
    let msg = '';
      return msg = '<center>please verify the number. <br><br> ' +
      '<b> ' + mobile + '</b></center>';
  }

  //delete this when API is ready on backend
  generateCode() {
    let chars ='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var result = '';
    for (var i = 10; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
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
