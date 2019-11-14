import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-travel-and-booking',
  templateUrl: './travel-and-booking.page.html',
  styleUrls: ['./travel-and-booking.page.scss'],
})
export class TravelAndBookingPage implements OnInit {
  tab = 'calendar';

  constructor() { }

  ngOnInit() {
  }

  show(tab) {
    this.tab = tab;
  }

}
