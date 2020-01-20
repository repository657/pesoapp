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

  getSalesHistory(userDetail: any, date: any) {

    const clientTxid = +new Date();
    const user = this.globalService.getUserDetails(userDetail);
    const authcode = this.globalService.createAuthCode(user.username, user.password, clientTxid.toString());
    const bothDate = (date.getFullYear() + '-' + date.getMonth() + 1) + '-' + date.getDate();

    const requestData = {
      username: user.username,
      authCode: authcode,
      fromdate: bothDate,
      todate: bothDate,
      client_transactionid: clientTxid,
      appname: user.appname,
    };

    const reqOpts = this.globalService.getHeaders(user.token, user.deviceId);

    return this.http.post<any>(SERVER_URL + 'saleshistory', requestData, reqOpts)
        .pipe(map(sales => {
           return sales;
    }));
  }

  getWalletHistory(userDetail: any) {

    const clientTxid = +new Date();
    const user = this.globalService.getUserDetails(userDetail);
    const authcode = this.globalService.createAuthCode(user.username, user.password, clientTxid.toString());

    const requestData = {
      username: user.username,
      partnerID: user.partnerID,
      branchID: 'ALL',
      fromdate: '',
      todate: '',
      authCode: authcode,
      client_transactionid: clientTxid,
      appname: user.appname,
    };

    const reqOpts = this.globalService.getHeaders(user.token, user.deviceId);

    return this.http.post<any>(SERVER_URL + 'wallethistory', requestData, reqOpts)
        .pipe(map(sales => {
           return sales;
    }));
  }
}
