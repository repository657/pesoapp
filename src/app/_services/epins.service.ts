import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HTTP } from '@ionic-native/http/ngx';
import { GlobalService } from './global.service';
import { SERVER_URL, SMS_URL } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EpinsService {

  constructor(private http: HttpClient, private globalService: GlobalService, private nativeHttp: HTTP) { } 

  getEpins(userDetail: any) {
    
    const clientTxid = +new Date();
    const user = this.globalService.getUserDetails(userDetail);
    const authcode = this.globalService.createAuthCode(user.username, user.password, clientTxid.toString());

    const requestData = {
      username: user.username,
      authCode: authcode,
      client_transactionid: clientTxid,
      appname: user.appname,
    };

    const reqOpts = this.globalService.getHeaders(user.token, user.deviceId);

    console.log(requestData);
    console.log(reqOpts);

    return this.http.post<any>(SERVER_URL + 'getEpinProduct', requestData, reqOpts)
        .pipe(map(product => {
           return product;
        }));
  }

  dispenseEpins(userDetail: any, epinDetails: any) {

    const clientTxid = +new Date();
    const user = this.globalService.getUserDetails(userDetail);
    const authCode = this.globalService.createAuthCode(user.username, user.password, clientTxid.toString());

    const requestData = {
      username: user.username,
      authCode: authCode,
      client_transactionid: clientTxid,
      appname: user.appname,
      planCode: epinDetails.planCode,
      targetSubsAccount: epinDetails.targetSubsAccount,
      email: epinDetails.email,
    };

    const reqOpts = this.globalService.getHeaders(user.token, user.deviceId);
    console.log(requestData);
    console.log(reqOpts);

    return this.http.post<any>(SERVER_URL + 'getEpin', requestData, reqOpts)
        .pipe(map(epin => {
           return epin;
        }));
    
  }

  sendSMS(data, result){
    const mobile = data.targetSubsAccount;
    const voucher = result.epin;
    const msg = 'You have purchased ' + data.planCode + ' Here is your voucher code: '+ voucher;
    const url = SMS_URL+'user=comworks&pass=c9c9da1f93820bc89008f0e83dcced4f&mobilenum='+mobile+'&fullmesg='+msg+'&originator=iBazmsg'
    console.log(url);

    const params = {
      user: 'comworks',
      pass: 'c9c9da1f93820bc89008f0e83dcced4f',
      mobilenum: mobile,
      fullmesg: msg,
      originator: 'iBazmsg'
    }
   
    return this.http.get(url, {responseType: 'text'}).pipe(map(epin => {return epin;}));
  }
}
