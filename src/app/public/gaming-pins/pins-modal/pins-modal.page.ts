import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-pins-modal',
  templateUrl: './pins-modal.page.html',
  styleUrls: ['./pins-modal.page.scss'],
})
export class PinsModalPage implements OnInit {

  @Input() public code;

  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {
  }

  async closeModal() {
    await this.modalCtrl.dismiss();
  }

}
