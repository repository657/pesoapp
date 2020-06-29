import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { WalletService } from 'src/app/_services/wallet.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BillService } from 'src/app/_services/bill.service';
import { first } from 'rxjs/internal/operators/first';
import { LoadingService } from 'src/app/_services/loading.service';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.page.html',
  styleUrls: ['./payment-list.page.scss'],
})
export class PaymentListPage implements OnInit {

  currentUser: any;
  uDetail: any;
  expiration: any;
  sub: any;
  headerTitle: any;
  categoryType: any;
  categoryIcon: any;
  banner: any;
  dataList = [];

  constructor(public loadingCtrl: LoadingController, private loading: LoadingService,
    private auth: AuthenticationService, public wallet: WalletService,
    private alertController: AlertController, private router: Router,
    private bill: BillService, public route: ActivatedRoute) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.auth.currentUser.subscribe(x => this.currentUser = x);
    this.uDetail = this.currentUser.data;
    this.expiration = this.auth.isExpired();
    if (this.expiration === true) {
      this.loading.present();
      this.getAllBillers(this.uDetail);
    } else {
      this.SessionExpired();
    }

    //get data from previous page
    this.sub = this.route.params.subscribe(params => {
      const catDetails = params;
      this.headerTitle = catDetails.title;
      this.categoryType = catDetails.val;
      this.categoryIcon = '../' + catDetails.icon;
      this.banner = '../../' + catDetails.banner;
    });

  }

  getAllBillers(userDetail: any) {
    this.bill.getBillers(userDetail).pipe(first()).subscribe(
      bill_list => {
        this.loading.dismiss();
        const billData = bill_list.body;
        this.dataList = [];
        for(const i of billData.data) {
          if(i.type === this.categoryType){
            this.dataList.push(i);
          }
        }
        console.log(this.dataList);
      },
      error => {
        console.log(error);
    });
  }

  gotoPayment(index: any){
    this.dataList[index].banner = this.banner;
    this.router.navigate(['/payments', this.dataList[index]])
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
