import { Component } from '@angular/core';
import { WalletService } from 'src/app/_services/wallet.service';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/_services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  today = Date.now();
  walletBal: any;
  currentUser: any;
  uDetail: any;
  public appList = [
    {title : 'Telco e-Load', url : '/e-load', icon : '../assets/img/smartphone-icon.png'},
    {title : 'Gaming Pins', url : '/gaming-pins', icon : '../assets/img/gaming-pins-icon.png'},
    {title : 'Bills Payment', url : '/bills-payment', icon : '../assets/img/payment-icon.png'},
    {title : 'Remittance', url : '/remittance', icon : '../assets/img/remittance-icon.png'},
    {title : 'Travel and Booking', url : '/travel-and-booking', icon : '../assets/img/airplane-icon.png'},
    {title : 'Loans', url : '/loans', icon : '../assets/img/loan-icon.png'},
    {title : 'Government Billers', url : '/government-billers', icon : '../assets/img/gov-icon.png'},
    {title : 'Report History', url : '/report-history', icon : '../assets/img/history-icon.png'}
  ];

  constructor(private authenticationService: AuthenticationService, public wallet: WalletService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.uDetail = this.currentUser.data;
    this.getWalletBal();
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
}
