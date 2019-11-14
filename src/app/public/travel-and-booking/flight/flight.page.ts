import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-flight',
  templateUrl: './flight.page.html',
  styleUrls: ['./flight.page.scss'],
})
export class FlightPage implements OnInit {
  sub: any;
  flightDetails: any;
  items = Array.from({length: 10}, (v, k) => k + 1);
  trip: any;
  fIata: any;
  tIata: any;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public loading: LoadingController) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      console.log(params);
      this.flightDetails = params;
      this.trip = params.type;

      const fRes = params.from.split('(');
      this.fIata = fRes[1].replace(')', '');
      const tRes = params.to.split('(');
      this.tIata = tRes[1].replace(')', '');
    });
  }

  async gotoPassengerDetails(items: any) {
    const fData = {
      id: items,
      flight: JSON.stringify(this.flightDetails)
    };
    const loader = await this.loading.create({
      spinner: 'crescent',
      cssClass: 'custom-loading',
      translucent: true,
      showBackdrop: true,
      mode: 'md',
      keyboardClose: true
    });

    await loader.present().then(() => {
      loader.dismiss();
      this.router.navigate(['passenger', fData]);
    }); // end loader.present
  }

}
