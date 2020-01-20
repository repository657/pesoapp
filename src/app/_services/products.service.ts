import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SERVER_URL } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient, private globalService: GlobalService) { }

  getAllPlanCodes(userDetail: any) {

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

    return this.http.post<any>(SERVER_URL + 'getPlancodes', requestData, reqOpts)
        .pipe(map(product => {
           return product;
        }));
  }

  getProductPrefixes(userDetail: any) {

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

    return this.http.post<any>(SERVER_URL + 'getPrefixes', requestData, reqOpts)
        .pipe(map(prefix => {
           return prefix;
        }));
  }

  loadCustomer(userDetail: any, loadDetails: any) {
    const clientTxid = +new Date();
    const user = this.globalService.getUserDetails(userDetail);
    const authCode = this.globalService.createAuthCode(user.username, user.password, clientTxid.toString());

    const requestData = {
      username: user.username,
      partnerid: user.partnerID,
      authcode: authCode,
      clientid: clientTxid,
      category: loadDetails.telco,
      productcode: loadDetails.product,
      prefix: loadDetails.prefix,
      mobnum: loadDetails.mobile,
      appname: user.appname,
    };

    const reqOpts = this.globalService.getHeaders(user.token, user.deviceId);

    return this.http.post<any>(SERVER_URL + 'loadcustomer', requestData, reqOpts)
        .pipe(map(load => {
           console.log(load);
           return load;
        }));
  }

}
