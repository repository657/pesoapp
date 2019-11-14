import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { IonSlides, NavController, IonContent, LoadingController, AlertController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-remittance',
  templateUrl: './remittance.page.html',
  styleUrls: ['./remittance.page.scss'],
})
export class RemittancePage implements OnInit, AfterViewInit {
  @ViewChild('slides', {static: false}) slides: IonSlides;
  @ViewChild('pageTop', {static: false}) pageTop: IonContent;
  @ViewChild('accountName', {static: false}) accountName;
  @ViewChild('accountNumber', {static: false}) accountNumber;
  @ViewChild('recipientNumber', {static: false}) recipientNumber;
  @ViewChild('PID', {static: false}) PID;
  @ViewChild('Firstname', {static: false}) Firstname;
  @ViewChild('Lastname', {static: false}) Lastname;
  @ViewChild('MobileNo', {static: false}) MobileNo;
  @ViewChild('Email', {static: false}) Email;
  @ViewChild('relationship', {static: false}) relationship;
  @ViewChild('others', {static: false}) others;
  @ViewChild('IDN', {static: false}) IDN;
  @ViewChild('issueDate', {static: false}) issueDate;
  @ViewChild('expireDate', {static: false}) expireDate;

  methodType: any;
  type: any;
  btype: any;
  aname: any;
  anumb: any;
  rnumb: any;
  adue: any;
  img: any;
  imageVal: any;
  id: any;
  idType: any;
  fn: any;
  ln: any;
  rel: any;
  idn: any;
  isdt: any;
  exdt: any;
  mob: any;
  eml: any;
  showMainContent = false;
  showOtherContent = false;
  showDetailContent = false;
  showFooterContent = false;
  showFooter = false;
  showNext = false;
  showConfirm = false;
  isNameDisabled = true;
  slideOpts;
  DECIMAL_SEPARATOR = '.';
  GROUP_SEPARATOR = ',';

  public methodList = [
    {title : 'Online Bank Transfer', val : 'bank', icon : '../assets/img/bank-icon.png'},
    {title : 'Smart Padala', val : 'padala', icon : '../assets/img/padala-icon.png'},
    {title : 'GCash', val : 'padala', icon : '../assets/img/gcash-icon.png'},
    {title : 'Western Union', val : 'others', icon : '../assets/img/western-icon.png'},
    {title : 'Cebuana Lhuillier Pera Padala', val : 'others', icon : '../assets/img/cebuana-icon.png'},
    {title : 'M Lhuillier', val : 'others', icon : '../assets/img/lhuillier-icon.png'}
  ];

  public bankList = [
    // tslint:disable-next-line: max-line-length
    {title : 'Bank of the Philippine Islands', val : '../assets/img/banks/banner/bpi-banner.png', icon : '../assets/img/banks/bpi-icon.png'},
    {title : 'BDO Unibank Inc', val : '../assets/img/banks/banner/bdo-banner.png', icon : '../assets/img/banks/bdo-icon.png'},
    {title : 'Metropolitan and Trust Bank', val : '../assets/img/banks/banner/mb-banner.png', icon : '../assets/img/banks/mb-icon.png'},
    {title : 'Land Bank of The Philippines', val : '../assets/img/banks/banner/lb-banner.png', icon : '../assets/img/banks/lb-icon.png'},
    {title : 'Security Bank Corporation', val : '../assets/img/banks/banner/sb-banner.png', icon : '../assets/img/banks/sb-icon.png'},
    {title : 'Philippine National Bank', val : '../assets/img/banks/banner/pnb-banner.png', icon : '../assets/img/banks/pnb-icon.png'},
    {title : 'China Banking Corporation', val : '../assets/img/banks/banner/cb-banner.png', icon : '../assets/img/banks/cb-icon.png'},
    // tslint:disable-next-line: max-line-length
    {title : 'Rizal Commercial Banking Corporation', val : '../assets/img/banks/banner/rcbc-banner.png', icon : '../assets/img/banks/rcbc-icon.png'},
    {title : 'EastWest Bank', val : '../assets/img/banks/banner/eb-banner.png', icon : '../assets/img/banks/eb-icon.png'},
    {title : 'Union Bank', val : '../assets/img/banks/banner/ub-banner.png', icon : '../assets/img/banks/ub-icon.png'}
  ];

  public purposeList = [
    {title : 'Family Support / Living Expenses'},
    {title : 'Savings / Investment'},
    {title : 'Gift'},
    {title : 'Good and Services Payment / Commercial Transaction'},
    {title : 'Travel Expenses'},
    {title : 'Education'},
    {title : 'Rent'},
    {title : 'Emergency'},
    {title : 'Charity'},
    {title : 'Price of lottery fees'},
    {title : 'Employee Payroll / Employee Expense'},
  ];

  public IDList = [
    {title : 'SSS / GSIS'}, {title : 'PAG-IBIG'}, {title : 'PHILHEALTH'},
    {title : 'DRIVERS LICENSE'}, {title : 'OWWA ID (OVERSEAS WORKERS)'}, {title : 'NBI Clearance'},
    {title : 'Voter\'s ID'}, {title : 'PWD ID'}, {title : 'STUDENT ID'},
    {title : 'UMID'}, {title : 'others'},
  ];

  constructor(public navCtrl: NavController,
              private alertController: AlertController,
              public loading: LoadingController,
              private toastCtrl: ToastController) {
    this.slideOpts = {
      effect: 'flip'
    };
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.slides.lockSwipes(true);
  }

  async nextSlide() {
    this.slides.lockSwipeToNext(false);
    this.slides.slideNext();
    this.pageTop.scrollToTop();
    this.showFooter = true;
    this.showNext = false;
    if (this.type === 'bank') {
      this.aname = this.accountName.value;
      this.anumb = this.accountNumber.value;
    } else if (this.type === 'padala') {
      this.rnumb = this.recipientNumber.value;
    } else {
      const isdate = new Date(this.issueDate.value);
      const exdate = new Date(this.expireDate.value);
      this.fn = this.Firstname.value;
      this.ln = this.Lastname.value;
      this.rel = this.relationship.value;
      this.mob = this.MobileNo.value;
      this.eml = this.Email.value;
      this.idn = this.IDN.value;
      if (this.issueDate.value !== undefined && this.issueDate.value !== undefined) {
        this.isdt = isdate.toISOString().substring(0, 10);
        this.exdt = exdate.toISOString().substring(0, 10);
      }
    }
  }

  async prevSlide() {
    this.slides.lockSwipeToPrev(false);
    this.slides.slidePrev();
    this.pageTop.scrollToTop();
    if (this.type === 'bank') {
      this.accountName.value = '';
      this.accountNumber.value = '';
    } else if (this.type === 'padala') {
      this.recipientNumber.value = '';
    } else {
      this.Firstname.value = '';
      this.Lastname.value = '';
      this.relationship.value = '';
      this.MobileNo.value = '';
      this.Email.value = '';
      this.IDN.value = '';
      this.issueDate.value = '';
      this.expireDate.value = '';
    }
    const currentIndex = this.slides.getActiveIndex();
    if (await currentIndex === 0) {
      this.showFooter = false;
    }
  }

  getRadVal(method: any, methodTitle: any) {
    this.type = method;
    this.methodType = methodTitle;
    if (this.type === 'bank') {
      this.showMainContent = true;
    } else {
      this.showMainContent = false;
    }
  }

  getRadVal2(bankType: any) {
    this.btype = bankType;
  }

  nextStep(flg: any) {
    if (flg.length > 0) {
      this.isNameDisabled = false;
    } else {
      this.isNameDisabled = true;
    }
  }

  finishStep(flg: any) {
    if (flg.length > 0) {
      if (this.type === 'others') {
        this.idType = (this.PID.value === 'others' ? this.others.value : this.PID.value);
        if (this.idType !== '' && this.Firstname.value !== '' && this.Lastname.value !== '' &&  this.IDN.value !== '') {
          this.showNext = true;
        } else {
          this.showNext = false;
        }
      } else {
        this.showNext = true;
      }
    } else {
      this.showNext = false;
    }
  }

  showAmount(am: any) {
    const zeny = am.replace(',', '');
    if (am.length > 0 && am.length < 7 && parseFloat(zeny) <= 50000) {
      let val = am;
      val = val.replace(/,/g, '');
      am = '';
      val += '';
      const x = val.split('.');
      let x1 = x[0];
      const x2 = x.length > 1 ? '.' + x[1] : '';

      const rgx = /(\d+)(\d{3})/;

      while (rgx.test(x1)) {
                  x1 = x1.replace(rgx, '$1' + ',' + '$2');
              }

      am = x1 + x2;
      this.showConfirm = true;
      return this.adue = am;
    } else {
      this.showConfirm = false;
      return this.adue = '';
    }
  }

  async sendMoney() {
    const loader = await this.loading.create({
      message: 'Processing please wait…',
    });

    await loader.present().then(async () => {
      loader.dismiss();
      const alert = await this.toastCtrl.create({
        message: 'Success on sending money',
        duration: 3000,
        position: 'top',
        showCloseButton: true
      });

      alert.present();
      this.adue = '';
      this.showConfirm = false;
    });
  }

  async showInfo() {
    const alert = await this.alertController.create({
      subHeader: 'You can transfer up to',
      message: 'PHP 50,000 per transaction',
      buttons: ['OKAY']
    });
    alert.present();
  }

  showOthers(val: any) {
    this.id = val;
  }

}
