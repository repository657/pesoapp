import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AuthGuardService } from './_guards/auth-guard.service';
import { AuthenticationService } from './_services/authentication.service';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { CalendarModule } from 'ion2-calendar';
import { IonicSelectableModule } from 'ionic-selectable';
import { ReactiveFormsModule } from '@angular/forms';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { CurrencyPipe } from '@angular/common';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    CalendarModule,
    IonicSelectableModule,
    ReactiveFormsModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    EmailComposer,
    AuthGuardService,
    AuthenticationService,
    CurrencyPipe,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
