import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-gov-modal',
  templateUrl: './gov-modal.page.html',
  styleUrls: ['./gov-modal.page.scss'],
})
export class GovModalPage implements OnInit {

  @Input() public detail;
  govDetail: any;

  biller: any;
  reference: any;
  amount: any;
  email: any;
  contact: any;

  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {
    this.govDetail = this.detail;
    this.biller = this.govDetail.bill.name;
    this.reference = this.govDetail.ref;
    this.amount = this.govDetail.amount;
    this.email = this.govDetail.email;
    this.contact = this.govDetail.contact;
  }

  async closeModal() {
    await this.modalCtrl.dismiss();
  }

  async submit() {
    await this.modalCtrl.dismiss(this.govDetail);
  }

}
