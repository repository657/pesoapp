import { Component, OnInit, ViewChildren, Input, QueryList, } from '@angular/core';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Validators, FormBuilder, FormGroup, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarModal, CalendarModalOptions, CalendarComponentOptions } from 'ion2-calendar';
import { CustomValidator } from 'src/app/_validators/custom-validator';

@Component({
  selector: 'app-passenger',
  templateUrl: './passenger.page.html',
  styleUrls: ['./passenger.page.scss'],
})
export class PassengerPage implements OnInit {

  nationalityList: any = [];
  sub: any;
  fDetails: any;
  traveler: any = [];
  isAssistance: boolean;


  public assistanceList = [
    {name: 'Expectant Mother'}, {name: 'Passenger with service animal in cabin'},
    {name: 'Portable oxygen concentrator for accompanied guest'},
    {name: 'Portable oxygen concentrator for unaccompanied guest'},
    {name: 'Wheelchair - Cabin'}, {name: 'Wheelchair - Ramp'}, {name: 'Wheelchair - Steps'}
  ];

  constructor(public modalCtrl: ModalController,
              public http: HttpClient,
              public route: ActivatedRoute,
              public router: Router,
              public alertController: AlertController,
              public loading: LoadingController,
              public formBuilder: FormBuilder) {

                this.isAssistance = false;

                this.http.get('assets/data/nationality.json').subscribe(data => {
                  const itemList = data['nationality'.toString()];
                  for (const itemKey of itemList) {
                    const name = {
                      name: itemKey
                    };
                    this.nationalityList.push(name);
                  }
                });

                this.sub = this.route.params.subscribe(params => {
                  this.fDetails = params;
                  const fd = JSON.parse(params.flight);
                  const fdT = JSON.parse(fd.traveler);
                  for (const itemKey of fdT.detail) {
                    for (let i = 0; i < itemKey.count; i++) {
                      const passenger = {
                        title: itemKey.title,
                        index: i,
                        checked: false
                      };
                      this.traveler.push(passenger);
                    }
                  }
                });
  }

  validationsForm: FormGroup;
  properties: FormArray;

  validationMessages = {
    title: [
      { type: 'required', message: 'title field should not be empty.' }
    ],
    firstname: [
      { type: 'required', message: 'firstname field should not be empty.' }
    ],
    lastname: [
      { type: 'required', message: 'lastname field should not be empty.' }
    ],
    dob: [
      { type: 'required', message: 'dob field should not be empty.' },
      { type: 'ageRestrict', message: 'passenger exceeds min/max age of specific passenger type.' },
    ],
    nationality: [
      { type: 'required', message: 'citizen field should not be empty.' }
    ],
    pwd: [
      { type: 'required', message: 'pwd field should not be empty.' }
    ],
    assist1: [
      { type: 'required', message: 'assist1 field should not be empty.' }
    ],
    assist2: [
      { type: 'required', message: 'assist2 field should not be empty.' }
    ],
    terms: [
      { type: 'required', message: 'please check terms and conditions.' }
    ]
  };


  ngOnInit() {
    this.validationsForm = this.formBuilder.group({
      properties: this.formBuilder.array([]),
      assistChecked: new FormControl(false),
      terms:  new FormControl(false, Validators.requiredTrue),
      assist1: new FormControl(''),
      assist2: new FormControl('')
    });
    this.addProperty();
  }

  createItem(title): FormGroup {
    return this.formBuilder.group({
      title: new FormControl('', Validators.compose([
        Validators.required
      ])),
      firstname: new FormControl('', Validators.compose([
        Validators.required
      ])),
      lastname: new FormControl('', Validators.compose([
        Validators.required
      ])),
      dob: new FormControl('', Validators.compose([
        Validators.required,
        CustomValidator.ageRestrictValidator(title)
      ])),
      nationality: new FormControl('', Validators.compose([
        Validators.required
      ])),
      pwdChecked: new FormControl(false),
      pwd: new FormControl('')
    });
  }

  addProperty() {
    console.log(this.traveler);
    for (const a of this.traveler) {
      this.properties = this.validationsForm.get('properties') as FormArray;
      this.properties.push(this.createItem(a.title));
    }
  }

  getProperties() {
    return (this.validationsForm.get('properties') as FormArray).controls;
  }


  isChecked() {
    const control = this.validationsForm.get('assistChecked').value;
    if (control) {
      this.isAssistance = true;
    } else {
      this.isAssistance = false;
    }
  }

  isPerson(index) {
    const pwdControl = (this.validationsForm.get('properties') as FormArray).controls;
    const flag = pwdControl[index]['controls'.toString()].pwdChecked.value;
    const pwd = pwdControl[index]['controls'.toString()].pwd;
    if (flag) {
      this.traveler[index].checked = true;
      pwd.setValidators(Validators.required);
    } else {
      this.traveler[index].checked = false;
      pwd.clearValidators();
    }
    pwd.updateValueAndValidity();
  }

  async help() {
    const alert = await this.alertController.create({
      header: 'INFORMATION',
      message: 'You can use up to two (2) assistance per flight.',
      buttons: ['CLOSE']
    });
    alert.present();
  }

  async onSubmit(value) {
    const loader = await this.loading.create({
      spinner: 'crescent',
      cssClass: 'custom-loading',
      translucent: true,
      showBackdrop: true,
      mode: 'md',
      keyboardClose: true
    });

    const cnt = value.properties.length;
    const p = value.properties;
    for (let i = 0; i < cnt; i++) {
      const seatLetter = this.makeId(1, 'ABCDEF');
      const seatNumber = (Math.round(Math.random() * 30));
      p[i].seat = seatLetter + seatNumber; // temporary
    }
    const pDetails = {
      travel: JSON.stringify(this.fDetails),
      passenger: JSON.stringify(value),
    };

    await loader.present().then(() => {
      loader.dismiss();
      this.router.navigate(['personalize', pDetails]);
    }); // end loader.present
  }

  // temporary seat generator
  makeId(length, characters) {
    let result           = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
 convertToDate(date) {
  const d = new Date(date);
  return d;
 }
}
