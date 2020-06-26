import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';
import { SERVER_URL } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EpinsService {

  constructor(private http: HttpClient, private globalService: GlobalService) { } 

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
    };

    const reqOpts = this.globalService.getHeaders(user.token, user.deviceId);
    console.log(requestData);
    console.log(reqOpts);

    return this.http.post<any>(SERVER_URL + 'getEpin', requestData, reqOpts)
        .pipe(map(epin => {
           return epin;
        }));
    
  }
}
