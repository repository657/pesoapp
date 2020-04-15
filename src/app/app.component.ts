import { Component } from '@angular/core';

import { Platform, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { GlobalService } from './_services/global.service';
import { AuthenticationService } from './_services/authentication.service';
import { Uid } from '@ionic-native/uid/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { AppState } from './_helpers/app.global';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  public appMenu = [
    {title : 'Home', url : '/home', icon : '../assets/img/home.png'},
    {title : 'Change Password', url : '/change-password', icon : '../assets/img/lock.png'},
  ];

  today = Date.now();
  loginData: any;
  username: any;
  token: any;
  deviceID: any;
  system: any;
  test: any;
  selectedTheme: String;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private global: GlobalService,
    private authenticationService: AuthenticationService,
    private androidPermissions: AndroidPermissions,
    private uid: Uid, private alertController: AlertController,
    private settings: AppState
  ) {
    this.settings.getActiveTheme().subscribe(val => this.selectedTheme = val);
    this.initializeApp();

    this.global.checkUser$.subscribe(data => {
      const d = JSON.stringify(data);
      const t = JSON.parse(d);
      if (t !== null) {
        const c = t['data'.toString()];
        for (const i of c) {
          this.loginData = i;
        }
        this.username = this.loginData.username;
        this.token = this.loginData.token;
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.system = (this.platform.is('cordova') ? 'mobile' : 'desktop');
      if (this.platform.is('cordova')) {
        this.getImei();
      }
      console.log(this.system);
    });
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigateByUrl('/login');
  }

  async getImei() {
    const { hasPermission } = await this.androidPermissions.checkPermission(
      this.androidPermissions.PERMISSION.READ_PHONE_STATE
    );

    if (!hasPermission) {
      const result = await this.androidPermissions.requestPermission(
        this.androidPermissions.PERMISSION.READ_PHONE_STATE
      );

      if (!result.hasPermission) {
        console.log('Permissions required');
        throw new Error('Permissions required');
      }

      // ok, a user gave us permission, we can get him identifiers after restart app
      const alert = await this.alertController.create({
        message: 'Permission Granted, App will restart!',
        buttons: [{
          text: 'OKAY',
          handler: () => {
            // (navigator as any).app.exitApp();
            window.location.reload();
          }}]
      });

      alert.present();
      return;
    }

    return this.uid.IMEI;
   }

}
