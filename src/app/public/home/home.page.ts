import { Component, OnInit } from '@angular/core';
import { WalletService } from 'src/app/_services/wallet.service';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Uid } from '@ionic-native/uid/ngx';
import { AppState } from 'src/app/_helpers/app.global';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  today = Date.now();
  walletBal: any;
  currentUser: any;
  uDetail: any;
  expiration: any;
  selectedTheme: String;


  public appList = [
    {title : 'Telco e-Load', url : '/e-load', icon : '../assets/img/smartphone-icon.png', grey: false},
    {title : 'Gaming Pins', url : '/gaming-pins', icon : '../assets/img/gaming-pins-icon.png', grey: false},
    // {title : 'ePins', url : '/e-pins', icon : '../assets/img/poptv-icon.png', grey: true},
    {title : 'Bills Payment', url : '/bills-payment', icon : '../assets/img/payment-icon.png', grey: false},
    {title : 'Remittance', url : '/remittance', icon : '../assets/img/remittance-icon.png', grey: false},
    {title : 'Travel and Booking', url : '/travel-and-booking', icon : '../assets/img/airplane-icon.png', grey: false},
    {title : 'Loans', url : '/loans', icon : '../assets/img/loan-icon.png', grey: false},
    {title : 'Government Billers', url : '/government-billers', icon : '../assets/img/gov-icon.png', grey: false},
    {title : 'Report History', url : '/report-history', icon : '../assets/img/history-icon.png', grey: false}
  ];

  constructor(private auth: AuthenticationService, public wallet: WalletService,
              private alertController: AlertController, private router: Router,
              private uid: Uid, private settings: AppState) {
                this.settings.getActiveTheme().subscribe(val => this.selectedTheme = val);
  }
  
  toggleAppTheme() {
    if (this.selectedTheme === 'theme-peso') {
      this.settings.setActiveTheme('theme-clickstore');
    } else {
      this.settings.setActiveTheme('theme-peso');
    }
  }

  ngOnInit() {
    console.log(this.selectedTheme);
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
        alert(error);
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
