import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { GlobalService } from './_services/global.service';
import { AuthenticationService } from './_services/authentication.service';

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

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private global: GlobalService,
    private authenticationService: AuthenticationService,
  ) {
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
    });
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigateByUrl('/login');
  }

}
