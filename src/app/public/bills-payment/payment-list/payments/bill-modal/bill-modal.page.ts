import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-bill-modal',
  templateUrl: './bill-modal.page.html',
  styleUrls: ['./bill-modal.page.scss'],
})
export class BillModalPage implements OnInit {

  @Input() public values;
  monthNames = ['January', 'Febuary', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
  dateToday: any;

  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {
    this.dateToday = this.GetFormattedDate();
    console.log(this.values);
  }

  async closeModal() {
    await this.modalCtrl.dismiss();
  }

  GetFormattedDate() {
    const todayTime = new Date();
    const month = (todayTime.getMonth());
    const day = todayTime.getDate()
    const year = todayTime.getFullYear()
    const h = todayTime.getHours() + ":"  
    const m = todayTime.getMinutes() + ":" 
    const s = todayTime.getSeconds();
    return day + " " + this.monthNames[month] + " " + year + " " + h+m+s;
  }

}
