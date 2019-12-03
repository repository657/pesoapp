import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-payment-bank',
  templateUrl: './payment-bank.page.html',
  styleUrls: ['./payment-bank.page.scss'],
})
export class PaymentBankPage implements OnInit {

  public bankList = [
    // tslint:disable-next-line: max-line-length
    {title : 'Bank of the Philippine Islands', val : '../assets/img/banks/banner/bpi-banner.png', icon : '../assets/img/banks/bpi-icon.png'},
    {title : 'BDO Unibank Inc.', val : '../assets/img/banks/banner/bdo-banner.png', icon : '../assets/img/banks/bdo-icon.png'},
    {title : 'Metropolitan and Trust Bank', val : '../assets/img/banks/banner/mb-banner.png', icon : '../assets/img/banks/mb-icon.png'},
    {title : 'Land Bank of The Philippines', val : '../assets/img/banks/banner/lb-banner.png', icon : '../assets/img/banks/lb-icon.png'},
    {title : 'Security Bank Corporation', val : '../assets/img/banks/banner/sb-banner.png', icon : '../assets/img/banks/sb-icon.png'},
    {title : 'Philippine National Bank', val : '../assets/img/banks/banner/pnb-banner.png', icon : '../assets/img/banks/pnb-icon.png'},
    {title : 'China Banking Corporation', val : '../assets/img/banks/banner/cb-banner.png', icon : '../assets/img/banks/cb-icon.png'},
    // tslint:disable-next-line: max-line-length
    {title : 'Rizal Commercial Banking Corporation', val : '../assets/img/banks/banner/rcbc-banner.png', icon : '../assets/img/banks/rcbc-icon.png'},
    {title : 'EastWest Bank', val : '../assets/img/banks/banner/eb-banner.png', icon : '../assets/img/banks/eb-icon.png'},
    {title : 'Union Bank', val : '../assets/img/banks/banner/ub-banner.png', icon : '../assets/img/banks/ub-icon.png'}
  ];

  sub: any;
  type: any;
  methodType: any;

  constructor(public route: ActivatedRoute,
              public router: Router,
              public location: Location) {
                this.sub = this.route.params.subscribe(params => {
                  console.log(params);
                  this.type = params.type;
                  this.methodType = params.method;
                });
              }

  ngOnInit() {
  }

  getRadVal(bankTitle, bankValue) {
    const bankDetails = {
      bankName: bankTitle,
      bankType: bankValue,
      type: this.type,
      method: this.methodType
    };
    this.router.navigate(['payment-details', bankDetails]);
  }

  prevPage() {
    this.location.back();
  }

}
