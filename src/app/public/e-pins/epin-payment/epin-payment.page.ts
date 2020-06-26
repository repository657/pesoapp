import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { WalletService } from 'src/app/_services/wallet.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { first } from 'rxjs/internal/operators/first';
import { EpinsService } from 'src/app/_services/epins.service';
import { ResponseDescription } from 'src/app/_helpers/response';
import { EpinModalPage } from 'src/app/public/e-pins/epin-payment/epin-modal/epin-modal.page';
import { AppState } from 'src/app/_helpers/app.global';

@Component({
  selector: 'app-epin-payment',
  templateUrl: './epin-payment.page.html',
  styleUrls: ['./epin-payment.page.scss'],
})
export class EpinPaymentPage implements OnInit {

  selectedTheme: any
  currentUser: any;
  uDetail: any;
  expiration: any;
  productList = [];
  sub: any;

  denom: any;
  discount: any;
  total: any;
  code: any;
  description: any;

  paymentForm: FormGroup;

  validationMessages = {
    targetSubsAccount: [
      { type: 'required', message: 'Mobile field should not be empty'},
      { type: 'minlength', message: 'min mobile number should be at least 11 digits' },
      { type: 'maxlength', message: 'max mobile number should not be over 11 digits ' },
      { type: 'pattern', message: 'Mobile number should contain only numeric' },
    ]
  };

  constructor(public loadingCtrl: LoadingController,
    private auth: AuthenticationService, public wallet: WalletService,
    private alertController: AlertController, private router: Router,
    private route: ActivatedRoute, private fb: FormBuilder,
    public loading: LoadingController, private epin: EpinsService,
    public resp: ResponseDescription,public modalCtrl: ModalController,
    private settings: AppState) {
      this.settings.getActiveTheme().subscribe(val => this.selectedTheme = val) }

  ngOnInit() {
    this.paymentForm = this.fb.group({
      targetSubsAccount: new FormControl('', Validators.compose([
        Validators.maxLength(11),
        Validators.minLength(11),
        Validators.pattern('^(0|[1-9][0-9]*)$'),
        Validators.required
      ])),
    });
  }

  ionViewDidEnter() {
    this.sub = this.route.params.subscribe(params => {
      this.code = params.planCode;
      this.description = params.description;
      this.denom = params.denomination;
      this.discount = params.discount;
      this.total = (this.denom - this.discount);
      console.log(this.total);
    });

    this.auth.currentUser.subscribe(x => this.currentUser = x);
    this.uDetail = this.currentUser.data;
    this.expiration = this.auth.isExpired();
    if (this.expiration === true) {
    } else {
      this.SessionExpired();
    }
  }

  async onSubmit(values){
    values.planCode = this.code;
    console.log(values);
    const alert = await this.alertController.create({
      message: this.getMessage(values),
      buttons: [{
        text: 'close'
      },{
        text: 'proceed',
        handler: async () => {
          this.payEpins(values);
        }
      }]
    });
    alert.present();
  }

  async payEpins(values) {
    const loader = await this.loading.create({
      message: 'Processing please wait…',
      spinner: 'crescent',
      mode: 'md',
    });

    await loader.present().then(async () => {
      this.epin.dispenseEpins(this.uDetail, values).pipe().subscribe(
        async epinStatus => {
          console.log(epinStatus);
          loader.dismiss();
          const respStatus = this.resp.statusDescription(epinStatus.body.status);
          const alert2 = await this.alertController.create({
            message: respStatus,
            buttons: [{
              text: 'View ePin',
              handler: async () => {
                this.viewPins(epinStatus.body.epin, epinStatus.body.client_transactionid);
              }
            }]
          });
          alert2.present();
          this.paymentForm.reset();
        },
        async error => {
          console.log(error);
          const alert = await this.alertController.create({
            message: error,
            buttons: ['close']
          });
          alert.present();
          this.paymentForm.reset();
      });
    }); // end loader.present
  }

  async viewPins(pins, txid) {
    const modal = await this.modalCtrl.create({
      component: EpinModalPage,
      componentProps: {
        code: pins,
        ref: txid,
      },
      cssClass: this.selectedTheme + ' my-custom-modal-css'
    });
    modal.onWillDismiss().then(async dataReturned => {

    });
    return await modal.present().then(_ => {});
  }

  getMessage(values: any){
      return '<center>please verify the number. <br><br> ' +
      '<b> ' + values.targetSubsAccount + '</b></center>';
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