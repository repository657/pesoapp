import { Component, OnInit, ViewChildren, Input, QueryList, } from '@angular/core';
import { ModalController, AlertController, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Validators, FormBuilder, FormGroup, FormControl, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-passenger',
  templateUrl: './passenger.page.html',
  styleUrls: ['./passenger.page.scss'],
})
export class PassengerPage implements OnInit {

  @ViewChildren('firstname') firstname;
  @ViewChildren('lastname') lastname;
  @ViewChildren('dob') dob;
  @ViewChildren('pwd') pwd;

  nationalityList: any = [];
  sub: any;
  fDetails: any;
  traveler: any = [];
  cnt = 0;
  public isAssistance: boolean;
  public isPWD: boolean;
  TSelect = [];
  NSelect = [];
  ASelect = [];

  public assistanceList = [
    {name: 'Expectant Mother'}, {name: 'Passenger with service animal in cabin'},
    {name: 'Portable oxygen concentrator for accompanied guest'},
    {name: 'Portable oxygen concentrator for unaccompanied guest'},
    {name: 'Wheelchair - Cabin'}, {name: 'Wheelchair - Ramp'}, {name: 'Wheelchair - Steps'}
  ];

  constructor(public modalCtrl: ModalController,
              private http: HttpClient,
              private route: ActivatedRoute,
              private router: Router,
              private alertController: AlertController,
              private loading: LoadingController,
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
    // password: [
    //   { type: 'required', message: 'Password field should not be empty'}
    // ]
  };


  ngOnInit() {
    this.validationsForm = this.formBuilder.group({
      properties: this.formBuilder.array([]),
    });
    this.addProperty();
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      title: new FormControl('', Validators.compose([
        Validators.required
      ])),
    });
  }

  addProperty() {
    for (const a of this.traveler) {
      this.properties = this.validationsForm.get('properties') as FormArray;
      this.properties.push(this.createItem());
    }
  }

  getProperties() {
    return (this.validationsForm.get('properties') as FormArray).controls;
  }


  isChecked() {
    if (this.isAssistance) {
      this.isAssistance = true;
    } else {
      this.isAssistance = false;
    }
  }

  isPerson(index: any) {
    console.log(this.traveler[index].checked);
    if (this.traveler[index].checked) {
      this.traveler[index].checked = true;
    } else {
      this.traveler[index].checked = false;
    }
  }

  async help() {
    const alert = await this.alertController.create({
      header: 'INFORMATION',
      message: 'You can use up to two (2) assistance per flight.',
      buttons: ['CLOSE']
    });
    alert.present();
  }

  async submit(value) {
    console.log(value);
    const loader = await this.loading.create({
      spinner: 'crescent',
      cssClass: 'custom-loading',
      translucent: true,
      showBackdrop: true,
      mode: 'md',
      keyboardClose: true
    });

    const cnt = this.firstname.toArray().length;
    const pList = [];
    for (let i = 0; i < cnt; i++) {
      const seatLetter = this.makeId(1, 'ABCDEF');
      const seatNumber = (Math.round(Math.random() * 30));
      const pass = {
        name: this.firstname.toArray()[i].value + ' ' + this.lastname.toArray()[i].value,
        title: this.TSelect[i],
        dob: this.dob.toArray()[i].value,
        nationality: this.NSelect[i],
        pwdID: (this.pwd.toArray()[i] === undefined ? '' : this.pwd.toArray()[i].value),
        assistance: this.ASelect[i],
        seat: seatLetter + seatNumber, // temporary
      };
      pList.push(pass);
    }

    const pDetails = {
      travel: JSON.stringify(this.fDetails),
      passenger: JSON.stringify(pList),
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
}
