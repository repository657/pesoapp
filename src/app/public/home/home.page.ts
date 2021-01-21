import { Component, OnInit } from '@angular/core';
import { WalletService } from 'src/app/_services/wallet.service';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Uid } from '@ionic-native/uid/ngx';
import { AppState } from 'src/app/_helpers/app.global';
import { SelectTheme } from 'src/app/_helpers/theme-selector';
import { HOME_MENU } from 'src/app/_helpers/theme_helper';

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
  homeTheme: any;


  public appList = [];

  constructor(private auth: AuthenticationService, public wallet: WalletService,
              private alertController: AlertController, private router: Router,
              private uid: Uid, private settings: AppState, public theme: SelectTheme) {
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
    // this.appList = this.theme.homeMenu(this.selectedTheme);
    this.homeTheme = HOME_MENU.find(t => t.name === this.selectedTheme);
    this.appList = this.homeTheme ? this.homeTheme.menus.map(m => m) : [];
    
    // this.getWalletBal();
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
    // this.auth.logout();
    // this.router.navigateByUrl('/login');
  }
}
