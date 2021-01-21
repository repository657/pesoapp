import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { WalletService } from 'src/app/_services/wallet.service';
import { Router } from '@angular/router';
import { first } from 'rxjs/internal/operators/first';
import { EpinsService } from 'src/app/_services/epins.service';
import { LoadingService } from 'src/app/_services/loading.service';

@Component({
  selector: 'app-e-pins',
  templateUrl: './e-pins.page.html',
  styleUrls: ['./e-pins.page.scss'],
})
export class EPinsPage implements OnInit {

  walletBal: any;
  currentUser: any;
  uDetail: any;
  expiration: any;
  productList = [];

  constructor(private loading: LoadingService,
    private auth: AuthenticationService, public wallet: WalletService,
    private alertController: AlertController, private router: Router,
    private epin: EpinsService) { }

  ngOnInit() { 
  }

  ionViewDidEnter() {
    this.auth.currentUser.subscribe(x => this.currentUser = x);
    this.uDetail = this.currentUser.data;
    this.expiration = this.auth.isExpired();
    // this.loading.present();
    // this.getWalletBal();
    // this.showEpinList();
    if (this.expiration === true) {
      this.loading.present();
      this.getWalletBal();
      this.showEpinList();
    } else {
      this.SessionExpired();
    }
  }

  async showEpinList() { 
    this.epin.getEpins(this.uDetail).pipe(first()).subscribe(
      epinData => {
        this.loading.dismiss();
        const details = epinData.body;
        this.productList = [];
        for(const i of details.data){
          if(i.brand.toLowerCase() === 'poptv'){
            this.productList.push(i);
          }
        }
        console.log(epinData.body);
      },
      error => {
        console.log(error);
    });
  }

  gotoPayment(index: any) {
    this.router.navigate(['/epin-payment', this.productList[index]]);
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
