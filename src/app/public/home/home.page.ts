import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  today = Date.now();
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

  constructor() {}
}
