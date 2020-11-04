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
import { File } from '@ionic-native/file/ngx';
import * as XLSX from 'xlsx';
import { SelectTheme } from 'src/app/_helpers/theme-selector';
import { AppVersion } from '@ionic-native/app-version/ngx';
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
              private settings: AppState, public storage: Storage, public file: File,
              private theme: SelectTheme, private appVersion: AppVersion) {
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
  filename: any;
  dirName: any;
  versionCode: any;

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
    const themeObj = this.theme.getLogo(this.selectedTheme);
    this.banner = themeObj['banner'];
    this.filename = themeObj['filename'];

    const system = (this.platform.is('cordova') ? 'mobile' : 'desktop');
    console.log(system);
    if (this.platform.is('cordova')) {
      this.platform.ready().then(() => {
        this.checkDirectory() 
        // this.checkFileExist();
      });
    }
  //  this.showID = 'unique1';
  //  this.showID = 'cwi-unique';
  // this.showID = '7bb171dc-9434-43e8-a8d2-c80b0004245c';

  this.appVersion.getVersionNumber().then(value => {
    this.versionCode = value;
    // alert(this.versionCode);
    }).catch(err => {
      console.log('login-page: '+err);
  });  
  }

  async onLogin(values) {
    console.log(values);
    const data = {
        username: values.username,
        password: values.password,
        device_id: this.showID,
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
    // alert(JSON.stringify(dataObj['device_id'.toString()]));
    this.readFile(this.dirName);
    let alert = await this.alertCtrl.create({
      message: this.showID,
      buttons: ['close']
    });
    alert.present();
  }

  checkDirectory(){
    const path = this.file.externalRootDirectory;
    this.file.checkDir(path, 'Download').then(
      res => true,
      err => false
      ).then(
        isExists => {
          if (isExists) {
            this.dirName = '/Download/';
            this.checkFileExist(this.dirName);
          }else {
            this.dirName = '/Downloads/';
            this.checkFileExist(this.dirName)
          }
        });
  }

  checkFileExist(dirName){
    const path = this.file.externalRootDirectory;
    this.file.checkFile(path + dirName, this.filename).then(
      res => true,
      err => false
    ).then(
      isExists => {
        if (isExists) {
          this.readFile(dirName);
        }else {
         // alert(path + this.dirName + this.filename);
          this.generateFile(dirName);
        }
      });
  }

  generateFile(dirName){
    const dataObj = [{device_id: uuidv4()}];
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataObj);
    const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], {type: 'application/octet-stream'});
    this.file.writeFile(this.file.externalRootDirectory + dirName, this.filename, data, { replace: false });
    this.showAppRestart();
  }

  async readFile(dirName) {
    const bstr: string = await this.file.readAsBinaryString(this.file.externalRootDirectory + dirName, this.filename);
    const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});
    const sheetName = wb.SheetNames;
    const dataArr = XLSX.utils.sheet_to_json(wb.Sheets[sheetName[0]]);
    const dataObj = dataArr[0];
    this.showID = dataObj['device_id'.toString()];
  }

  async showAppRestart() {
    const alert = await this.alertCtrl.create({
      message: 'Device ID Generated, App will restart!',
      buttons: [ {
        text: 'OKAY',
        handler: () => {
          window.location.reload();
        }
      }]
    });

    await alert.present();
  }

}
