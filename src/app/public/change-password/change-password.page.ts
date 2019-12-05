import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomValidator } from 'src/app/_validators/custom-validator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

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

  constructor(public formBuilder: FormBuilder,
              public router: Router) { }

  ngOnInit() {
    this.validationsForm = this.formBuilder.group({
      newPassword: new FormControl('', Validators.compose([
        Validators.required
      ])),
      confirmPassword: new FormControl('', Validators.compose([
        Validators.required,
      ])),
    });
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

  onSubmit(value) {
    console.log(value);
  }

  backMenu() {
    this.router.navigate(['home']);
  }

}
