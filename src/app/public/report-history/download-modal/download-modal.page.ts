import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, ToastController, AlertController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { EmailComposer } from '@ionic-native/email-composer/ngx';
import * as XLSX from 'xlsx';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { Platform } from '@ionic/angular';
import { HistoryService } from 'src/app/_services/history.service';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SelectTheme } from 'src/app/_helpers/theme-selector';
import { AppState } from 'src/app/_helpers/app.global';
@Component({
  selector: 'app-download-modal',
  templateUrl: './download-modal.page.html',
  styleUrls: ['./download-modal.page.scss'],
})
export class DownloadModalPage implements OnInit {

  daysData: any;
  reportType: any;
  currentUser: any;
  uDetail: any;
  expiration = this.auth.isExpired();

  isCustomData = false;

  validationsForm: FormGroup;
  validationMessages = {
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
      { type: 'required', message: 'Type is required.'},
    ]
  };

  daysList = [
    {name: '7 days', value: 7}, {name: '15 days', value: 15}, {name: '30 days', value: 30},
    {name: 'custom', value: 'custom'}, ];

  selectedTheme: any;
  public dropdownMenu = [];

  constructor(public modalCtrl: ModalController,
              public loadingCtrl: LoadingController,
              public formBuilder: FormBuilder,
              private file: File, private platform: Platform,
              public history: HistoryService, private router: Router,
              public auth: AuthenticationService,
              public toastController: ToastController,
              private alertController: AlertController, private settings: AppState,
              public theme: SelectTheme) {
                this.settings.getActiveTheme().subscribe(val => this.selectedTheme = val);
              }

  ngOnInit() {
    this.validationsForm = this.formBuilder.group({
      days: new FormControl('', Validators.compose([
        Validators.required
      ])),
      from: new FormControl(''),
      to: new FormControl(''),
      type: new FormControl('')
    });

    this.auth.currentUser.subscribe(x => this.currentUser = x);
    this.uDetail = this.currentUser.data;
    if (this.expiration === true) {
      this.dropdownMenu = this.theme.historyMenu(this.selectedTheme);
    } else {
      this.SessionExpired();
    }
  }

  async closeModal() {
    await this.modalCtrl.dismiss();
  }

  isCustom(event) {
    const from = this.validationsForm.get('from');
    const to = this.validationsForm.get('to');
    this.daysData = event.target.value;
    if (this.daysData === 'custom') {
      this.isCustomData = true;
      from.setValidators(Validators.required);
      to.setValidators(Validators.required);
    } else {
      this.isCustomData = false;
      from.clearValidators();
      to.clearValidators();
    }
    from.updateValueAndValidity();
    to.updateValueAndValidity();
  }

  getType(value) {
    this.reportType = value;
  }

  async onSubmit(value) {
    console.log(value);
    const loader = await this.loadingCtrl.create({
      message: 'Processing please wait…',
      spinner: 'crescent',
      mode: 'md',
    });

    await loader.present().then(async () => {
      if (value.days !== 'custom') {
        const pastDate = this.getPastDate(new Date(), value.days);
        console.log(pastDate);
        const from = this.changeDateFormat(pastDate);
        const to = this.changeDateFormat(new Date());
        loader.dismiss();
        if (this.expiration === true) {
          this.getHistory(value.type, from, to, 'download');
        } else {
          this.SessionExpired();
        }

      } else {
        const fromFormat = new Date(value.from);
        const toFormat = new Date(value.to);
        const from = this.changeDateFormat(fromFormat);
        const to = this.changeDateFormat(toFormat);
        loader.dismiss();
        if (this.expiration === true) {
          this.getHistory(value.type, from, to, 'download');
        } else {
          this.SessionExpired();
        }

      }
    }); // end loader.present

  }

  async getHistory(type, from, to, classType) {
    console.log(this.expiration);
    if (type === 'sales') {
      this.history.getSalesHistory(this.uDetail, '', from, to, classType).pipe(
        first()).subscribe(
        salesData => {
          const sales = salesData.body;
          const resultHistory = sales.data;
          console.log(sales);
          this.createExcelReport(resultHistory, type);
        },
        async error => {
          console.log(error);
          const toast = await this.toastController.create({
            message: 'Error downloading file.',
            duration: 5000
          });
          toast.present();
      });
    } else if (type === 'wallet'){
      this.history.getWalletHistory(this.uDetail, '', from, to, classType).pipe(first()).subscribe(
        walletData => {
          const wallet = walletData.body;
          const resultHistory = wallet.data;
          this.createExcelReport(resultHistory, type);
        },
        async error => {
          console.log(error);
          const toast = await this.toastController.create({
            message: 'Error downloading file.',
            duration: 5000
          });
          toast.present();
      });
    } else if (type === 'bills'){
      this.history.billsPaymentHistory(this.uDetail, '', from, to, classType).pipe(first()).subscribe(
        billsData => {
          const bills = billsData.body;
          const resultHistory = bills.data;
          this.createExcelReport(resultHistory, type);
        },
        async error => {
          console.log(error);
          const toast = await this.toastController.create({
            message: 'Error downloading file.',
            duration: 5000
          });
          toast.present();
      });
    } else if (type === 'epins'){
      this.history.epinsHistory(this.uDetail, '', from, to, classType).pipe(first()).subscribe(
        epinsData => {
          const epins = epinsData.body;
          const resultHistory = epins.data;
          this.createExcelReport(resultHistory, type);
        },
        async error => {
          console.log(error);
          const toast = await this.toastController.create({
            message: 'Error downloading file.',
            duration: 5000
          });
          toast.present();
      });
    }
  }

  async createExcelReport(historyData, type) {
    console.log(historyData);
    /* write a workbook */
    // const plt = this.platform.platforms();
    const DataObj = (historyData === undefined ? [{message: 'No matching records found'}] : historyData);

    let filename = (type === 'sales' ? 'Sales_History' : 'Wallet_History');
    const dirName = '/Download';
    const FILE_EXTENSION = '.xlsx';
    const todayDate = new  Date();
    const getDate = (todayDate.getFullYear() + '-' + todayDate.getMonth() + 1) + '-' + todayDate.getDate();


    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(DataObj);
    const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const data: Blob = new Blob([excelBuffer], {type: 'application/octet-stream'});
    filename = filename + getDate + '-' + new Date().getTime() + FILE_EXTENSION;

    XLSX.writeFile(workbook, filename); // for browser only
    this.file.writeFile(this.file.externalRootDirectory + dirName, filename, data, { replace: true });
    const toast = await this.toastController.create({
      message: 'File successfully downloaded. Check your downloads folder.',
      duration: 5000,
      buttons: ['CLOSE']
    });
    toast.present();
  }

  changeDateFormat(date) {
    const monthNames = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    return '' + year + '-' + monthNames[monthIndex] + '-' + day;
  }
  getPastDate(date, days) {
    const res = date.setDate(date.getDate() - days);
    return date = new Date(res);
  }

  async SessionExpired() {
    const alert = await this.alertController.create({
      message: 'Session expired please login.',
      buttons: ['OK']
    });

    alert.present();
    await this.modalCtrl.dismiss();
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

}
