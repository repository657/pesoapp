import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, LoadingController, ToastController, Platform, NavController, Events, MenuController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/_services/global.service';
import { first } from 'rxjs/operators';
import { ResponseDescription } from 'src/app/_helpers/response';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  device: any;
  system: any;

  constructor(public alertCtrl: AlertController, public loading: LoadingController,
              public router: Router, public toastCtrl: ToastController,
              public formBuilder: FormBuilder, public uniqueDeviceID: UniqueDeviceID,
              public platform: Platform, public authService: AuthenticationService,
              public navCtrl: NavController, public browserHttp: HttpClient, private mobileHttp: HTTP,
              public event: Events, public menuCtrl: MenuController,
              public global: GlobalService, public resp: ResponseDescription) {

    this.uniqueDeviceID.get().then((uuid: any) =>
      this.device = uuid
    ).catch((error: any) => console.log(error));
    this.system = this.platform.is('ios') ? mobileHttp : (this.platform.is('android') ? mobileHttp : browserHttp);
    console.log(this.system);
    console.log(this.device);
  }

  validationsForm: FormGroup;

  validationMessages = {
    username: [
      { type: 'required', message: 'Username field should not be empty.' }
    ],
    password: [
      { type: 'required', message: 'Password field should not be empty'}
    ]
  };

  errorMessage: any;
  errFLG = false;

  ngOnInit() {
    this.validationsForm = this.formBuilder.group({
      username: new FormControl('', Validators.compose([
        Validators.required
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required
      ])),
    });
  }

  async onLogin(values) {
    console.log(values);
    // const data = {
    //     username: values.username,
    //     password: values.password,
    //     device_id: this.device
    // };

    const data = {
      username: 'peso_dealer',
      password: 'default',
      device_id: 'unique1'
    };

    const loader = await this.loading.create({
            message: 'Processing please wait…',
            spinner: 'crescent',
            mode: 'md',
    });

    await loader.present().then(() => {

          this.authService.login(data)
            .pipe(first())
            .subscribe(
                data2 => {
                    loader.dismiss();
                    const response = data2['data'.toString()];
                    if (response !== undefined) {
                      this.global.getUserData(data2);
                      this.router.navigate(['home']);
                    } else {
                      const returnDesc = this.resp.getDescription(Object.keys(data2));
                      this.errFLG = true;
                      this.errorMessage = returnDesc;
                      this.authService.logout();
                    }
                },
                error => {
                  loader.dismiss();
                  this.errFLG = true;
                  this.errorMessage = error;
                  this.authService.logout();
          });















          //   this.browserHttp.post('https://app.pesocoop.net/' + 'login', data, httpOptions)
          //   .pipe( map((res) => res))
          //   .subscribe(res => {
          //     console.log(res);
          //     loader.dismiss();

          //     if (res !== null || res !== undefined) {
          //         this.authService.login(res);
          //         this.router.navigate(['home', res]);

          //     } else {
          //       this.errFLG = true;
          //       this.errorMessage = 'Your Login Username or Password is invalid.';
          //     }

          //   }, (err: any) => {
          //     loader.dismiss();
          //     console.log(err);
          //     console.log('error timeout, please contact your server administrator.');
          //     this.errFLG = true;
          //     this.errorMessage = 'error timeout, please contact your server administrator.';
          // }); // end subscribe

    }); // end loader.present
  }


}
