import { Component, OnInit, ViewChildren, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-payment-amount',
  templateUrl: './payment-amount.page.html',
  styleUrls: ['./payment-amount.page.scss'],
})
export class PaymentAmountPage implements OnInit {
  @ViewChild('amount', {static: true}) amt;
  sub: any;
  type: any;
  methodType: any;

  accountName: any;
  accountNumber: any;

  recipientNumber: any;

  name: any;
  relationship: any;
  primaryID: any;
  IDNumber: any;
  IssueDate: any;
  ExpirationDate: any;

  amountDue = 0;

  showConfirm = false;

  constructor(public route: ActivatedRoute,
              public router: Router,
              public location: Location,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController) {
              this.sub = this.route.params.subscribe(params => {
                console.log(params);
                this.type = params.type;
                this.methodType = params.method;
                if (this.type === 'bank') {
                  this.accountName = params.accountName;
                  this.accountNumber = params.accountNumber;
                } else if (this.type === 'padala') {
                  this.recipientNumber = params.recipientNumber;
                } else {
                  const d = JSON.parse(params.details);
                  this.name = d.firstname + ' ' + d.lastname;
                  this.relationship = d.relationship;
                  this.primaryID = (d.pid === 'others' ? d.others : d.pid);
                  this.IDNumber = d.idn;
                  this.IssueDate = this.convertDatetime(d.issueDate);
                  this.ExpirationDate = this.convertDatetime(d.expireDate);
                }
              });
            }

  ngOnInit() {
  }

  prevPage() {
    this.location.back();
  }

  validateAmount(ev) {
    if (ev.target.value > 0) {
      this.showConfirm = true;
    } else {
      this.showConfirm = false;
    }
    this.amountDue = ev.target.value;
    return this.amountDue;
  }

  async showInfo() {
    const alert = await this.alertCtrl.create({
      subHeader: 'You can transfer up to',
      message: 'PHP 50,000 per transaction',
      buttons: ['OKAY']
    });
    alert.present();
  }

  async sendMoney() {
    const loader = await this.loadingCtrl.create({
      message: 'Processing please wait…',
    });

    await loader.present().then(async () => {
      loader.dismiss();
      const alert = await this.alertCtrl.create({
        message: 'Success on sending money',
        buttons: ['CLOSE']
      });

      alert.present();
      this.amountDue = 0;
      this.amt.value = '';
      this.showConfirm = false;
      this.router.navigate(['home']);
    });
  }

  convertDatetime(value) {
    const date = new Date(value);
    let day = date.getDay().toString();
    let month = (date.getMonth() + 1).toString();
    const year = date.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [year, month, day].join('-');
  }
}
