import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
@Component({
  selector: 'app-payment-details',
  templateUrl: './payment-details.page.html',
  styleUrls: ['./payment-details.page.scss'],
})
export class PaymentDetailsPage implements OnInit {

  bDetails: any;
  pDetails: any;
  oDetails: any;

  sub: any;

  bankName: any;
  bankType: any;

  icon: any;
  padalaName: any;
  id: any;

  type: any;
  methodType: any;

  isNameDisabled = true;
  isOthers = false;
  showNext = false;

  // bank
  @ViewChild('accountName', {static: false}) accountName;
  @ViewChild('accountNumber', {static: false}) accountNumber;
  // padala
  @ViewChild('recipientNumber', {static: false}) recipientNumber;
  // others
  validationsForm: FormGroup;


  public purposeList = [
    {title : 'Family Support / Living Expenses'},
    {title : 'Savings / Investment'},
    {title : 'Gift'},
    {title : 'Good and Services Payment / Commercial Transaction'},
    {title : 'Travel Expenses'},
    {title : 'Education'},
    {title : 'Rent'},
    {title : 'Emergency'},
    {title : 'Charity'},
    {title : 'Price of lottery fees'},
    {title : 'Employee Payroll / Employee Expense'},
  ];

  public IDList = [
    {title : 'SSS / GSIS'}, {title : 'PAG-IBIG'}, {title : 'PHILHEALTH'},
    {title : 'DRIVERS LICENSE'}, {title : 'OWWA ID (OVERSEAS WORKERS)'}, {title : 'NBI Clearance'},
    {title : 'Voter\'s ID'}, {title : 'PWD ID'}, {title : 'STUDENT ID'},
    {title : 'UMID'}, {title : 'others'},
  ];

  constructor(public route: ActivatedRoute,
              public router: Router,
              public location: Location,
              public formBuilder: FormBuilder) {
                this.sub = this.route.params.subscribe(params => {
                  console.log(params);
                  this.type = params.type;
                  this.methodType = params.method;
                  if (this.type === 'bank') {
                    this.bDetails = params;
                    this.bankName = params.bankName;
                    this.bankType = params.bankType;
                  } else if (this.type === 'padala') {
                    this.pDetails = params;
                    this.padalaName = params.method;
                    if (params.method === 'Smart Padala') {
                      this.icon = '../assets/img/banner/smart.png';
                    } else {
                      this.icon = '../assets/img/banner/globe.png';
                    }
                  } else {
                    this.oDetails = params;
                  }
                });
              }

  ngOnInit() {
    this.validationsForm = this.formBuilder.group({
      firstname: new FormControl('', Validators.compose([
        Validators.required
      ])),
      lastname: new FormControl('', Validators.compose([
        Validators.required
      ])),
      mobile: new FormControl(''),
      email: new FormControl(''),
      purpose: new FormControl('', Validators.compose([
        Validators.required
      ])),
      relationship: new FormControl('', Validators.compose([
        Validators.required
      ])),
      pid: new FormControl('', Validators.compose([
        Validators.required
      ])),
      others: new FormControl(''),
      idn: new FormControl('', Validators.compose([
        Validators.required
      ])),
      issueDate: new FormControl('', Validators.compose([
        Validators.required
      ])),
      expireDate: new FormControl('', Validators.compose([
        Validators.required
      ])),
    });
  }

  nextStep(flg: any) {
    if (flg.length > 0) {
      this.isNameDisabled = false;
    } else {
      this.isNameDisabled = true;
    }
  }

  finishStep(flg: any) {
    if (flg.length > 0) {
      this.showNext = true;
    } else {
      this.showNext = false;
    }
  }

  showOthers(val: any) {
    this.id = val;
    if (this.id === 'others') {
      this.isOthers = true;
    } else {
      this.isOthers = false;
    }
  }

  prevPage() {
    this.location.back();
  }

  nextPage(formData) {
    if (this.type === 'bank') {
      const objString = JSON.stringify(this.bDetails);
      const bankDetails = JSON.parse(objString);
      bankDetails['accountName'.toString()] = this.accountName.value;
      bankDetails['accountNumber'.toString()] = this.accountNumber.value;
      this.router.navigate(['payment-amount', bankDetails]);
    } else if (this.type === 'padala') {
      const objString = JSON.stringify(this.pDetails);
      const padalaDetails = JSON.parse(objString);
      padalaDetails['recipientNumber'.toString()] = this.recipientNumber.value;
      this.router.navigate(['payment-amount', padalaDetails]);
    } else {
      const objString = JSON.stringify(this.oDetails);
      const otherDetails = JSON.parse(objString);
      otherDetails['details'.toString()] = JSON.stringify(formData);
      this.router.navigate(['payment-amount', otherDetails]);
    }
  }

}
