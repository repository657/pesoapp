import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { SERVER_URL } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WalletService {

  constructor(private globalService: GlobalService,
              private http: HttpClient) { }

  getWallet(userDetail: any) {
    const clientTxid = +new Date();
    const user = this.globalService.getUserDetails(userDetail);
    const authcode = this.globalService.createAuthCode(user.username, user.password, clientTxid.toString());

    const requestData = {
      username: user.username,
      partnerID: user.partnerID,
      authCode: authcode,
      client_transactionid: clientTxid,
      appname: user.appname,
    };

    const reqOpts = this.globalService.getHeaders(user.token, user.deviceId);

    console.log(requestData);
    console.log(reqOpts);

    // return this.http.post<any>(SERVER_URL + 'getWallet', requestData, reqOpts)
    //     .pipe(map(wallet => {
    //        return wallet;
    //     }));
  }
}
