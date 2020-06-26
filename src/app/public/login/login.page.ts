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
              private settings: AppState, public storage: Storage, public file: File) {
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
  dirName = '/Download/';
  filename: any;

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
   if(this.selectedTheme === 'theme-peso') {
    this.banner = 'assets/img/peso_logo_banner.png';
    this.filename = 'device_id_PESO(do_not_delete_or_move).xlsx'
   } else {
    this.banner = 'assets/img/Click_Store.png';
    this.filename = 'device_id_CLICKSTORE(do_not_delete_or_move).xlsx'
   }
   const system = (this.platform.is('cordova') ? 'mobile' : 'desktop');
   console.log(system);
   if (this.platform.is('cordova')) {
    this.checkFileExist();
   }
   
  }

  async onLogin(values) {
    console.log(values);
    // alert(this.uid);
    const data = { //
        username: values.username,
        password: values.password,
        // device_id: this.showID,
        device_id: 'unique1'
        // device_id: 'cwi-unique'
        // device_id: 'd13c5cba-44e1-48c7-ab08-9850d1da542b'
        // device_id: 'cdba1dbd-7cd0-4cb5-bd3d-f93dbe774605' // drich peso
        // device_id: '474a3b5e-cb07-4404-a446-749616e28423' // ed cwi
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
    this.readFile();
    let alert = await this.alertCtrl.create({
      message: this.showID,
      buttons: ['close']
    });
    alert.present();
  }

  checkFileExist(){
    this.file.checkFile(this.file.externalRootDirectory + this.dirName, this.filename)
        .then(res => {
          console.log(res)
          // console.log('file exists ' + this.file.externalRootDirectory + this.dirName + res)
          this.readFile();
        }).catch(err =>{
          console.log(err)
          // alert('file doesn\'t exist ' + this.file.externalRootDirectory + this.dirName + err)
          this.generateFile();
        });
  }

  generateFile(){
    const dataObj = [{device_id: uuidv4()}];
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataObj);
    const workbook: XLSX.WorkBook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], {type: 'application/octet-stream'});
    this.file.writeFile(this.file.externalRootDirectory + this.dirName, this.filename, data, { replace: false });
    this.showAppRestart();
  }

  async readFile() {
    const bstr: string = await this.file.readAsBinaryString(this.file.externalRootDirectory + this.dirName, this.filename);
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
