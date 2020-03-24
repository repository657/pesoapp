import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { IonSlides, NavController, IonContent, LoadingController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { WalletService } from 'src/app/_services/wallet.service';
import { first } from 'rxjs/internal/operators/first';
@Component({
  selector: 'app-remittance',
  templateUrl: './remittance.page.html',
  styleUrls: ['./remittance.page.scss']
})
export class RemittancePage implements OnInit {

  public methodList = [
    {title : 'Online Bank Transfer', val : 'bank', icon : '../assets/img/bank-icon.png'},
    {title : 'Smart Padala', val : 'padala', icon : '../assets/img/padala-icon.png'},
    {title : 'GCash', val : 'padala', icon : '../assets/img/gcash-icon.png'},
    {title : 'Western Union', val : 'others', icon : '../assets/img/western-icon.png'},
    {title : 'Cebuana Lhuillier Pera Padala', val : 'others', icon : '../assets/img/cebuana-icon.png'},
    {title : 'M Lhuillier', val : 'others', icon : '../assets/img/lhuillier-icon.png'}
  ];

  walletBal: any;
  currentUser: any;
  uDetail: any;
  expiration: any;

  constructor(public navCtrl: NavController,
              public alertController: AlertController,
              public loading: LoadingController,
              public route: ActivatedRoute,
              public router: Router,
              private auth: AuthenticationService, public wallet: WalletService) {
  }

  ngOnInit() {}

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

  selectMethod(value, methodType) {
    if (value === 'bank') {
      this.router.navigate(['payment-bank', {type: value, method: methodType}]);
    } else {
      this.router.navigate(['payment-details', {type: value, method: methodType}]);
    }
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
