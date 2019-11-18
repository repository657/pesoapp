import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private alertCtrl: AlertController,
              public loading: LoadingController,
              public router: Router,
              private toastCtrl: ToastController,
              public formBuilder: FormBuilder) {
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

    const loader = await this.loading.create({
            message: 'Processing please wait…',
            spinner: 'crescent',
            mode: 'md',
          });

    await loader.present().then(() => {
            loader.dismiss();
            this.router.navigate(['home']);
    }); // end loader.present

    // await loader.present().then(() => {
          //   this.http.post('http://localhost:6001/users/login/',data,options)
          //   .pipe(map((res) => res.json()))
          //   .subscribe(res => {
          //     console.log(res);
          //     loader.dismiss()

          //     if(res['message']=='success'){
          //         this.authService.login();
          //       // this.event.publish('userLogged',res);
          //       // this.navCtrl.push(HomePage, res);

          //     }else{

          //       const alert = this.alertCtrl.create({
          //         header:'ERROR',
          //         subHeader:'Your Login Username or Password is invalid',
          //         buttons: ['OK']
          //       }).then(alert=> alert.present());

          //     }

          //   }); // end subscribe

          // }); // end loader.present
  }


}
