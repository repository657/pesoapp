import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';
import { SERVER_URL } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor(private http: HttpClient, private globalService: GlobalService) { }

  getSalesHistory(userDetail: any, date: any, from: any, to: any, classType: any) {

    const clientTxid = +new Date();
    const user = this.globalService.getUserDetails(userDetail);
    const authcode = this.globalService.createAuthCode(user.username, user.password, clientTxid.toString());
    let bothDate: any;

    if (classType === 'view') {
      bothDate = date;
    }

    console.log(bothDate);
    const requestData = {
      username: user.username,
      authCode: authcode,
      fromdate: (classType === 'view' ? bothDate : from),
      todate: (classType === 'view' ? bothDate : to),
      client_transactionid: clientTxid,
      appname: user.appname,
    };
    console.log(requestData);
    const reqOpts = this.globalService.getHeaders(user.token, user.deviceId);

    return this.http.post<any>(SERVER_URL + 'saleshistory', requestData, reqOpts)
        .pipe(map(sales => {
           return sales;
    }));
  }

  getWalletHistory(userDetail: any, date: any, from: any, to: any, classType: any) {

    const clientTxid = +new Date();
    const user = this.globalService.getUserDetails(userDetail);
    const authcode = this.globalService.createAuthCode(user.username, user.password, clientTxid.toString());
    let bothDate: any;

    if (classType === 'view') {
      bothDate = date;
    }

    const requestData = {
      username: user.username,
      partnerID: user.partnerID,
      branchID: 'ALL',
      fromdate: (classType === 'view' ? bothDate : from),
      todate: (classType === 'view' ? bothDate : to),
      authCode: authcode,
      client_transactionid: clientTxid,
      appname: user.appname,
    };

    const reqOpts = this.globalService.getHeaders(user.token, user.deviceId);

    console.log(requestData);
    console.log(reqOpts);

    return this.http.post<any>(SERVER_URL + 'wallethistory', requestData, reqOpts)
        .pipe(map(sales => {
           return sales;
    }));
  }

  billsPaymentHistory(userDetail: any, date: any, from: any, to: any, classType: any) {
    const clientTxid = +new Date();
    const user = this.globalService.getUserDetails(userDetail);
    const authcode = this.globalService.createAuthCode(user.username, user.password, clientTxid.toString());
    let bothDate: any;

    if (classType === 'view') {
      bothDate = date;
    }

    const requestData = {
      username: user.username,
      fromdate: (classType === 'view' ? bothDate : from),
      todate: (classType === 'view' ? bothDate : to),
      authCode: authcode,
      client_transactionid: clientTxid,
      appname: user.appname,
    };

    const reqOpts = this.globalService.getHeaders(user.token, user.deviceId);

    console.log(requestData);
    console.log(reqOpts);

    return this.http.post<any>(SERVER_URL + 'billspaymenthistory', requestData, reqOpts)
        .pipe(map(bills => {
           return bills;
    }));
  }
  epinsHistory(userDetail: any, date: any, from: any, to: any, classType: any) {
    const clientTxid = +new Date();
    const user = this.globalService.getUserDetails(userDetail);
    const authcode = this.globalService.createAuthCode(user.username, user.password, clientTxid.toString());
    let bothDate: any;

    if (classType === 'view') {
      bothDate = date;
    }

    const requestData = {
      username: user.username,
      fromdate: (classType === 'view' ? bothDate : from),
      todate: (classType === 'view' ? bothDate : to),
      authCode: authcode,
      client_transactionid: clientTxid,
      appname: user.appname,
    };

    const reqOpts = this.globalService.getHeaders(user.token, user.deviceId);

    return this.http.post<any>(SERVER_URL + 'epinshistory', requestData, reqOpts)
        .pipe(map(sales => {
           return sales;
    }));
  }
}
