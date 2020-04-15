import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AuthGuardService } from './_guards/auth-guard.service';
import { AuthenticationService } from './_services/authentication.service';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpXhrBackend, HttpBackend  } from '@angular/common/http';
import { CalendarModule } from 'ion2-calendar';
import { IonicSelectableModule } from 'ionic-selectable';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import { CurrencyPipe } from '@angular/common';
import { HttpClientXsrfModule } from '@angular/common/http';
import { GlobalService } from './_services/global.service';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { HTTP } from '@ionic-native/http/ngx';
import { NativeHttpModule, NativeHttpBackend, NativeHttpFallback } from 'ionic-native-http-connection-backend';
import { ResponseDescription } from './_helpers/response';
import { ProductsService } from './_services/products.service';
import { ChangeService } from './_services/change.service';
import { WalletService } from './_services/wallet.service';
import { HistoryService } from './_services/history.service';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { Uid } from '@ionic-native/uid/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { AppState } from './_helpers/app.global';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'My-Xsrf-Cookie',
      headerName: 'My-Xsrf-Header',
    }),
    CalendarModule,
    IonicSelectableModule,
    ReactiveFormsModule,
    FormsModule,
    NativeHttpModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    EmailComposer,
    AuthGuardService,
    AuthenticationService,
    CurrencyPipe,
    UniqueDeviceID,
    Uid,
    AndroidPermissions,
    GlobalService,
    HTTP, File, FileOpener,
    ResponseDescription,
    ProductsService,
    ChangeService,
    WalletService,
    HistoryService,
    AppState,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {provide: HttpBackend, useClass: NativeHttpFallback, deps: [Platform, NativeHttpBackend, HttpXhrBackend]},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
