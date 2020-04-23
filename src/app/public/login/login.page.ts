import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController, Platform, NavController, Events, MenuController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ResponseDescription } from 'src/app/_helpers/response';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/_services/global.service';
import { first, timeout } from 'rxjs/operators';
import { Uid } from '@ionic-native/uid/ngx';
import { AppState } from 'src/app/_helpers/app.global';
import { Storage } from '@ionic/storage';
import { v4 as uuidv4 } from 'uuid';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(public alertCtrl: AlertController, public loading: LoadingController,
              public router: Router, public toastCtrl: ToastController,
              public formBuilder: FormBuilder, private uid: Uid,
              public platform: Platform, public authService: AuthenticationService,
              public navCtrl: NavController, public browserHttp: HttpClient,
              public event: Events, public menuCtrl: MenuController,
              public global: GlobalService, public resp: ResponseDescription,
              private settings: AppState, public storage: Storage) {
                this.settings.getActiveTheme().subscribe(val => this.selectedTheme = val);
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
  selectedTheme: String;
  banner: any;
  showID: any;

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

  ionViewDidEnter() {
   if(this.selectedTheme === 'theme-peso') {
    this.banner = 'assets/img/peso_logo_banner.png';
   } else {
    this.banner = 'assets/img/Click_Store.png';
   }

   this.storage.get('id').then(data=> {
    if(data){
      //with data
      this.showID = data;
    }
    else{
      this.storage.set('id', uuidv4());
    }
   });
   
  }

  async onLogin(values) {
    console.log(values);
    // alert(this.uid);
    const data = { //
        username: values.username,
        password: values.password,
        device_id: this.showID,
        // device_id: 'unique1'
        // device_id: 'cwi-unique'
        // device_id: '352161090731153' // tata
        // device_id: '359667090748768' // 
        // device_id: '38ee23f8-5f45-49f8-929e-6b74a5db6c75'
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
                    const code = Object.keys(data2).toString().toUpperCase();
                    if (response !== undefined) {
                      this.global.getUserData(data2);
                      this.router.navigate(['home']);
                    } else {
                      const returnDesc = this.resp.getDescription(code);
                      this.errFLG = true;
                      this.errorMessage = returnDesc;
                      this.authService.logout();
                    }
                },
                error => {
                  console.log(error);
                  loader.dismiss();
                  this.errFLG = true;
                  this.errorMessage = error;
                  this.authService.logout();
          });

    }); // end loader.present
  }

  async showDeviceID() {
    let alert = await this.alertCtrl.create({
      message: this.showID,
      buttons: ['close']
    });
    alert.present();
  }

}
