import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { IonSlides, NavController, IonContent, LoadingController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-remittance',
  templateUrl: './remittance.page.html',
  styleUrls: ['./remittance.page.scss']
})
export class RemittancePage implements OnInit, AfterViewInit {

  public methodList = [
    {title : 'Online Bank Transfer', val : 'bank', icon : '../assets/img/bank-icon.png'},
    {title : 'Smart Padala', val : 'padala', icon : '../assets/img/padala-icon.png'},
    {title : 'GCash', val : 'padala', icon : '../assets/img/gcash-icon.png'},
    {title : 'Western Union', val : 'others', icon : '../assets/img/western-icon.png'},
    {title : 'Cebuana Lhuillier Pera Padala', val : 'others', icon : '../assets/img/cebuana-icon.png'},
    {title : 'M Lhuillier', val : 'others', icon : '../assets/img/lhuillier-icon.png'}
  ];

  constructor(public navCtrl: NavController,
              public alertController: AlertController,
              public loading: LoadingController,
              public route: ActivatedRoute,
              public router: Router) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  selectMethod(value, methodType) {
    if (value === 'bank') {
      this.router.navigate(['payment-bank', {type: value, method: methodType}]);
    } else {
      this.router.navigate(['payment-details', {type: value, method: methodType}]);
    }
  }
}
