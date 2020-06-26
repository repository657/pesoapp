import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';
import { SERVER_URL } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BillService {

  constructor(private http: HttpClient, private globalService: GlobalService) { }

  getBillers(userDetail: any) {

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

    return this.http.post<any>(SERVER_URL + 'getBillers', requestData, reqOpts)
        .pipe(map(product => {
           return product;
        }));
  }

  getBillerFields(userDetail: any, billerCode: any) {

    const clientTxid = +new Date();
    const user = this.globalService.getUserDetails(userDetail);
    const authcode = this.globalService.createAuthCode(user.username, user.password, clientTxid.toString());

    const requestData = {
      username: user.username,
      authCode: authcode,
      client_transactionid: clientTxid,
      appname: user.appname,
      biller_code: billerCode,
    };

    const reqOpts = this.globalService.getHeaders(user.token, user.deviceId);

    console.log(requestData);
    console.log(reqOpts);

    return this.http.post<any>(SERVER_URL + 'getBillerParams', requestData, reqOpts)
        .pipe(map(product => {
           return product;
        }));
  }

  payBill(userDetail: any, billerDetails: any, is_Dummy: any){
    let a = JSON.stringify(billerDetails);
    const clientTxid = +new Date();
    const user = this.globalService.getUserDetails(userDetail);
    const authcode = this.globalService.createAuthCode(user.username, user.password, clientTxid.toString());

    const requestData = {
      username: user.username,
      authCode: authcode,
      client_transactionid: clientTxid,
      appname: user.appname,
      isDummy: is_Dummy,
      partnerID: user.partnerID,
      billerParams: a,

    };

    const reqOpts = this.globalService.getHeaders(user.token, user.deviceId);

    console.log(requestData);
    console.log(reqOpts);

    return this.http.post<any>(SERVER_URL + 'billspayment', requestData, reqOpts)
        .pipe(map(product => {
           return product;
        }));
  }
}
