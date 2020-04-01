import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './_guards/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './public/login/login.module#LoginPageModule' },
  { path: 'home', loadChildren: './public/home/home.module#HomePageModule', canActivate: [AuthGuardService] },
  { path: 'e-load', loadChildren: './public/e-load/e-load.module#ELoadPageModule', canActivate: [AuthGuardService]  },
  // tslint:disable-next-line: max-line-length
  { path: 'bills-payment', loadChildren: './public/bills-payment/bills-payment.module#BillsPaymentPageModule', canActivate: [AuthGuardService]  },
  { path: 'remittance', loadChildren: './public/remittance/remittance.module#RemittancePageModule', canActivate: [AuthGuardService]  },
  // tslint:disable-next-line: max-line-length
  { path: 'travel-and-booking', loadChildren: './public/travel-and-booking/travel-and-booking.module#TravelAndBookingPageModule', canActivate: [AuthGuardService]  },
  { path: 'loans', loadChildren: './public/loans/loans.module#LoansPageModule', canActivate: [AuthGuardService]  },
  // tslint:disable-next-line: max-line-length
  { path: 'government-billers', loadChildren: './public/government-billers/government-billers.module#GovernmentBillersPageModule', canActivate: [AuthGuardService]  },
  { path: 'report-history', loadChildren: './public/report-history/report-history.module#ReportHistoryPageModule' },
  { path: 'gaming-pins', loadChildren: './public/gaming-pins/gaming-pins.module#GamingPinsPageModule', canActivate: [AuthGuardService]  },
  { path: 'flight', loadChildren: './public/travel-and-booking/flight/flight.module#FlightPageModule', canActivate: [AuthGuardService]  },
  // tslint:disable-next-line: max-line-length
  { path: 'passenger', loadChildren: './public/travel-and-booking/passenger/passenger.module#PassengerPageModule', canActivate: [AuthGuardService]  },
  // tslint:disable-next-line: max-line-length
  { path: 'personalize', loadChildren: './public/travel-and-booking/personalize/personalize.module#PersonalizePageModule', canActivate: [AuthGuardService]  },
  { path: 'review', loadChildren: './public/travel-and-booking/review/review.module#ReviewPageModule', canActivate: [AuthGuardService]  },
  // tslint:disable-next-line: max-line-length
  { path: 'payment-details', loadChildren: './public/remittance/payment-details/payment-details.module#PaymentDetailsPageModule', canActivate: [AuthGuardService]  },
  // tslint:disable-next-line: max-line-length
  { path: 'payment-amount', loadChildren: './public/remittance/payment-amount/payment-amount.module#PaymentAmountPageModule', canActivate: [AuthGuardService]  },
  // tslint:disable-next-line: max-line-length
  { path: 'payment-bank', loadChildren: './public/remittance/payment-bank/payment-bank.module#PaymentBankPageModule', canActivate: [AuthGuardService]  },
  // tslint:disable-next-line: max-line-length
  { path: 'change-password', loadChildren: './public/change-password/change-password.module#ChangePasswordPageModule', canActivate: [AuthGuardService]  },
  { path: 'e-pins', loadChildren: './public/e-pins/e-pins.module#EPinsPageModule' },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
