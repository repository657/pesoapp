import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-market-place',
  templateUrl: './market-place.page.html',
  styleUrls: ['./market-place.page.scss'],
})
export class MarketPlacePage implements OnInit {

  constructor(public loading: LoadingController) { }

  async ngOnInit() {
    const loader = await this.loading.create({
      message: 'Processing please wait…',
      spinner: 'crescent',
      mode: 'md',
    });
    await loader.present().then(async () => {
      window.location.href = 'https://www.comworksclickstore.ph';
    });// end loader.present
  }

}
