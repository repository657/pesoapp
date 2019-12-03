import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './public/login/login.module#LoginPageModule' },
  { path: 'home', loadChildren: './public/home/home.module#HomePageModule' },
  { path: 'e-load', loadChildren: './public/e-load/e-load.module#ELoadPageModule' },
  { path: 'bills-payment', loadChildren: './public/bills-payment/bills-payment.module#BillsPaymentPageModule' },
  { path: 'remittance', loadChildren: './public/remittance/remittance.module#RemittancePageModule' },
  { path: 'travel-and-booking', loadChildren: './public/travel-and-booking/travel-and-booking.module#TravelAndBookingPageModule' },
  { path: 'loans', loadChildren: './public/loans/loans.module#LoansPageModule' },
  { path: 'government-billers', loadChildren: './public/government-billers/government-billers.module#GovernmentBillersPageModule' },
  { path: 'report-history', loadChildren: './public/report-history/report-history.module#ReportHistoryPageModule' },
  { path: 'gaming-pins', loadChildren: './public/gaming-pins/gaming-pins.module#GamingPinsPageModule' },
  { path: 'flight', loadChildren: './public/travel-and-booking/flight/flight.module#FlightPageModule' },
  { path: 'passenger', loadChildren: './public/travel-and-booking/passenger/passenger.module#PassengerPageModule' },
  { path: 'personalize', loadChildren: './public/travel-and-booking/personalize/personalize.module#PersonalizePageModule' },
  { path: 'review', loadChildren: './public/travel-and-booking/review/review.module#ReviewPageModule' },
  { path: 'payment-details', loadChildren: './public/remittance/payment-details/payment-details.module#PaymentDetailsPageModule' },
  { path: 'payment-amount', loadChildren: './public/remittance/payment-amount/payment-amount.module#PaymentAmountPageModule' },
  { path: 'payment-bank', loadChildren: './public/remittance/payment-bank/payment-bank.module#PaymentBankPageModule' },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
