import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidator } from 'src/app/_validators/custom-validator';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ChangeService } from 'src/app/_services/change.service';
import { first } from 'rxjs/operators';
import { ResponseDescription } from 'src/app/_helpers/response';
import { LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  currentUser: any;
  uDetail: any;
  errorMessage: any;
  errFLG = false;

  validationsForm: FormGroup;

  validationMessages = {
    newPassword: [
      { type: 'required', message: 'password field should not be empty.' }
    ],
    confirmPassword: [
      { type: 'required', message: 'confirm password field should not be empty'},
      { type: 'notSame', message: 'password does not match.'}
    ],
  };

  npw: any;
  walletBal: any;

  constructor(public formBuilder: FormBuilder,
              public router: Router,
              public authenticationService: AuthenticationService,
              public change: ChangeService,
              public resp: ResponseDescription,
              public loading: LoadingController,
              public alertController: AlertController) {

    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }
  x: any;
  ngOnInit() {
    this.validationsForm = this.formBuilder.group({
      newPassword: new FormControl('', Validators.compose([
        Validators.required
      ])),
      confirmPassword: new FormControl('', Validators.compose([
        Validators.required,
      ])),
    });

    this.uDetail = this.currentUser.data;
    this.x = this.uDetail[0].password;
  }

  newPW(ev) {
    this.npw = ev.target.value;
  }

  changePW() {
    const controller = this.validationsForm['controls'.toString()].confirmPassword;
    if (controller.value !== undefined) {
      controller.setValidators(CustomValidator.verifyPassword(this.npw));
    } else {
      controller.clearValidators();
    }
    controller.updateValueAndValidity();
  }

  async onSubmit(value) {
    const loader = await this.loading.create({
      message: 'Processing please wait…',
      spinner: 'crescent',
      mode: 'md',
    });

    await loader.present().then(async () => {

      this.change.changePassword(this.uDetail, value.confirmPassword).pipe(first()).subscribe(
        async response => {
          console.log('RESPONSE');
          console.log(response);

          loader.dismiss();
          const alert = await this.alertController.create({
            message: 'password has changed, you will be redirected to login page.',
            buttons: ['close']
          });

          alert.present();
          this.validationsForm.reset();
          // this.authenticationService.logout();
          // this.router.navigateByUrl('/login');
        },
        async error => {
          console.log('ERROR');
          console.log(error);
          loader.dismiss();
          const alert = await this.alertController.create({
            message: error,
            buttons: ['close']
          });

          alert.present();
        }
      );

}); // end loader.present

  }

  backMenu() {
    this.router.navigate(['home']);
  }

}
