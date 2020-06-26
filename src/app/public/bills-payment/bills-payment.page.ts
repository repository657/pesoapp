import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { WalletService } from 'src/app/_services/wallet.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/internal/operators/first';
import { BillService } from 'src/app/_services/bill.service';

@Component({
  selector: 'app-bills-payment',
  templateUrl: './bills-payment.page.html',
  styleUrls: ['./bills-payment.page.scss'],
})
export class BillsPaymentPage implements OnInit {

  walletBal: any;
  currentUser: any;
  uDetail: any;
  expiration: any;

  categories = [
    {title : 'Electric Utilities', val : 'ELECTRICITY', url : '/payment-list', 
      icon : '../../assets/img/Bills/electricity-icon.png', banner: '../../assets/img/payments/web-electricity.png'
    },
    {title : 'Water Utilities', val : 'WATER', url : '/payment-list', 
      icon : '../../assets/img/Bills/water-icon.png', banner: '../../assets/img/payments/web-water.png'
    },
    {title : 'Internet/Cable', val : 'INTERNET / CABLE TV', url : '/payment-list', 
      icon : '../../assets/img/Bills/internet-icon.png', banner: '../../assets/img/payments/web-internet.png'
    },
    {title : 'Telecoms', val : 'TELCO', url : '/payment-list', 
      icon : '../../assets/img/Bills/telco-icon.png', banner: '../../assets/img/payments/web-telco.png'
    },
    {title : 'Insurance', val : 'INSURANCE, PRE-NEED, & HEALTHCARE', url : '/payment-list', 
      icon : '../../assets/img/Bills/insurance-icon.png', banner: '../../assets/img/payments/web-insurance.png'
    },
  ];

  constructor(public loadingCtrl: LoadingController,
              private auth: AuthenticationService, public wallet: WalletService,
              private alertController: AlertController, private router: Router) {
              }

  ngOnInit() {}

  ionViewDidEnter() {
    this.auth.currentUser.subscribe(x => this.currentUser = x);
    this.uDetail = this.currentUser.data;
    this.expiration = this.auth.isExpired();
    if (this.expiration === true) {
      this.getWalletBal();
    } else {
      this.SessionExpired();
    }
  }

  gotoList(url: any, index: any) {
    this.router.navigate([url, this.categories[index]]);
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
