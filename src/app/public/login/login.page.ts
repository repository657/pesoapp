import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  @ViewChild('username', {static: false}) username;
  @ViewChild('password', {static: false}) password;

  constructor(private alertController: AlertController,
              public loading: LoadingController,
              public router: Router,
              private toastCtrl: ToastController) {

  }

  async login() {

    if (this.username.value === '' ) {

      const alert = await this.toastCtrl.create({
        message: 'Username field should not be empty',
        mode: 'md',
        duration: 3000,
        position: 'top',
        buttons: ['CLOSE']
      });

      alert.present();


    } else if (this.password.value === '') {

      const alert = await this.toastCtrl.create({
        message: 'Password field should not be empty',
        mode: 'md',
        duration: 3000,
        position: 'top',
        buttons: ['CLOSE']
      });

      alert.present();
    } else {

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

    } // end else
  }

  ngOnInit() {
  }

}
