import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-download-modal',
  templateUrl: './download-modal.page.html',
  styleUrls: ['./download-modal.page.scss'],
})
export class DownloadModalPage implements OnInit {

  daysData: any;

  isCustomData = false;

  daysList = [
    {name: '7 days', value: 7},
    {name: '30 days', value: 30},
    {name: '60 days', value: 60},
    {name: 'custom', value: 'custom'},
  ];

  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {
  }

  async closeModal() {
    await this.modalCtrl.dismiss();
  }

  isCustom(event) {
    if (event.target.value === 'custom') {
      this.isCustomData = true;
    } else {
      this.isCustomData = false;
    }
  }

  async submit() {
    await this.modalCtrl.dismiss('test');
  }

}
