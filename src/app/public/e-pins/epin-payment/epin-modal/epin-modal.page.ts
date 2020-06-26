import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-epin-modal',
  templateUrl: './epin-modal.page.html',
  styleUrls: ['./epin-modal.page.scss'],
})
export class EpinModalPage implements OnInit {

  @Input() public code;
  @Input() public ref;

  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {
  }

  async closeModal() {
    await this.modalCtrl.dismiss();
  }

}
