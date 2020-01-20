import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Component({
  selector: 'app-download-modal',
  templateUrl: './download-modal.page.html',
  styleUrls: ['./download-modal.page.scss'],
})
export class DownloadModalPage implements OnInit {

  daysData: any;
  reportType: any;

  isCustomData = false;

  daysList = [
    {name: '7 days', value: 7},
    {name: '30 days', value: 30},
    {name: '60 days', value: 60},
    {name: 'custom', value: 'custom'},
  ];

  validationsForm: FormGroup;
  validationMessages = {
    email: [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ],
    days: [
      { type: 'required', message: 'Days is required.'}
    ],
    from: [
      { type: 'required', message: 'From is required.'}
    ],
    to: [
      { type: 'required', message: 'To is required.'},
    ],
    type: [
      { type: 'required', message: 'To is required.'},
    ]
  };

  constructor(public modalCtrl: ModalController,
              public loadingCtrl: LoadingController,
              public formBuilder: FormBuilder,
              private emailComposer: EmailComposer) {
  }

  ngOnInit() {
    this.validationsForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      days: new FormControl('', Validators.compose([
        Validators.required
      ])),
      from: new FormControl(''),
      to: new FormControl(''),
      type: new FormControl('')
    });
  }

  async closeModal() {
    await this.modalCtrl.dismiss();
  }

  isCustom(event) {
    const from = this.validationsForm.get('from');
    const to = this.validationsForm.get('to');
    this.daysData = event.target.value;
    if (event.target.value === 'custom') {
      this.isCustomData = true;
      from.setValidators(Validators.required);
      to.setValidators(Validators.required);
    } else {
      this.isCustomData = false;
      from.clearValidators();
      to.clearValidators();
    }
    this.validationsForm.updateValueAndValidity();
  }

  getType(value) {
    this.reportType = value;
  }

  async onSubmit(value) {
    // await this.modalCtrl.dismiss('test');
    const loader = await this.loadingCtrl.create({
      message: 'Processing please wait…',
      spinner: 'crescent',
      mode: 'md',
    });

    const sendMail = {
      to: value.email,
      subject: 'test email',
      body: 'this is just a test email',
      isHtml: true
    };

    this.emailComposer.open(sendMail);

  }

}
