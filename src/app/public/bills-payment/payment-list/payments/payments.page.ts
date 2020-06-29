import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController, ModalController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { WalletService } from 'src/app/_services/wallet.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BillService } from 'src/app/_services/bill.service';
import { first } from 'rxjs/internal/operators/first';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { ResponseDescription } from 'src/app/_helpers/response';
import { BillModalPage } from './bill-modal/bill-modal.page';
import { AppState } from 'src/app/_helpers/app.global';
import * as moment from 'moment';
import { LoadingService } from 'src/app/_services/loading.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.page.html',
  styleUrls: ['./payments.page.scss'],
})
export class PaymentsPage implements OnInit {

  selectedTheme: any
  currentUser: any;
  uDetail: any;
  expiration: any;
  sub: any;
  billerCode: any;
  fieldBanner: any;
  fee: any;
  billerName: any;
  fieldList = [];

  validationsForm: FormGroup;
  properties: FormArray;

  constructor(public loadingCtrl: LoadingController, private loading: LoadingService,
    private auth: AuthenticationService, public wallet: WalletService,
    private alertController: AlertController, private router: Router,
    private bill: BillService, public route: ActivatedRoute,
    private fb: FormBuilder, public resp: ResponseDescription, public modalCtrl: ModalController,
    private settings: AppState) {
      this.settings.getActiveTheme().subscribe(val => this.selectedTheme = val)
    }

  ngOnInit() {
    this.validationsForm = this.fb.group({
      billerParams: this.fb.array([])
    });
  }

  ionViewDidEnter() {
    this.auth.currentUser.subscribe(x => this.currentUser = x);
    this.uDetail = this.currentUser.data;
    //get data from previous page
    this.sub = this.route.params.subscribe(params => {
      const catDetails = params;
      this.billerCode = catDetails.billercode;
      this.fieldBanner = catDetails.banner;
      this.fee = catDetails.fee;
      this.billerName = catDetails.billername;
      console.log(catDetails);
    });
    this.expiration = this.auth.isExpired();
    if (this.expiration === true) {
      this.loading.present();
      this.getBillerFields(this.uDetail);
    } else {
      this.SessionExpired();
    }
  }

  getBillerFields(userDetail: any){
    this.bill.getBillerFields(userDetail, this.billerCode).pipe(first()).subscribe(
      field => {
        this.loading.dismiss();
        const dataFields = field.body;
        this.fieldList = [];
        for(const i of dataFields.data) {
          this.fieldList.push(i)
          this.properties = this.validationsForm.get('billerParams') as FormArray;
          this.properties.push(this.fb.group({[i.field] :  new FormControl('', Validators.required)}));
        }
        console.log(this.fieldList);
      },
      error => {
        console.log(error);
    });
  }

  async onSubmit(values) {
    const params = {} // store values in params object
    for(const a of values.billerParams){
      const key = Object.keys(a);
      const val = Object.values(a);
      for(const b of val) {
        if(key.toString().toLowerCase().includes('date')){
          params[key.toString()] = moment(b).format('YYYY-MM-DD'); 
        } else {
          params[key.toString()] = b;
        }
      }
    }
    params['biller'] = this.billerCode;
    // this.test(params);
    if (this.expiration === true) {
      this.billsPayment(params);
    } else {
      this.SessionExpired();
    }
  }

  async billsPayment(parameters) {
    const loader = await this.loadingCtrl.create({
      message: 'Processing please wait…',
      spinner: 'crescent',
      mode: 'md',
    });

    await loader.present().then(async () => {
      this.bill.payBill(this.uDetail, parameters, 0).pipe(first()).subscribe(
        async payStatus => {
          loader.dismiss();
          console.log(payStatus);
          const respStatus = this.resp.paymentDescription(payStatus.body.status, payStatus.body.resultMessage);
          const alert = await this.alertController.create({
            message: respStatus,
            buttons: [{
              text: 'close',
              handler: () => {
                // this.router.navigate(['/bills-payment']);
              }
            }]
          });
          alert.present();
        },
        async error => {
          loader.dismiss();
          const alert = await this.alertController.create({
            message: error,
            buttons: [{
              text: 'close',
              handler: () => {
                // this.router.navigate(['/bills-payment']);
              }
            }]
          });
          alert.present();
        }
      )
    }); // end loader.present
  }

  // async test(parameters) {
  //   const resp = {
  //     "account_number": "0000016241",
  //     "amount": 125,
  //     "biller": "BC_SONYL",
  //     "due_date": "2019-12-31",
  //     "receiptValidationNo": "1201A85151430",
  //     "resultCode": "000",
  //     "resultMessage": "Transaction successful.",
  //     "status": "1",
  //     "statusdesc": "Success/Approved",
  //     "transactionNo": "201271A854BTW3IAF"
  //  };
  //   this.openModal(resp);
  // }

  async openModal(response) {
    const modal = await this.modalCtrl.create({
      component: BillModalPage,
      componentProps: {
        values: response
      },
      cssClass: this.selectedTheme,
    });
    modal.onWillDismiss().then(async dataReturned => {

    });
    return await modal.present().then(_ => {});
  }

  async validationMessage(msg) {
    const alert = await this.alertController.create({
      message: msg,
      buttons: ['close']
    });
    alert.present();
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
