import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse, HttpHeaders } from '@angular/common/http';
import { SERVER_URL } from 'src/environments/environment';
import { GlobalService } from './global.service';
import { map, tap, catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChangeService {

  constructor(private http: HttpClient, private globalService: GlobalService) { }

  changePassword(userDetail: any, newPassword: any): Observable<any> {

    const clientTxid = +new Date();
    const user = this.globalService.getUserDetails(userDetail);
    const authcode = this.globalService.createAuthCode(user.username, user.password, clientTxid.toString());

    const requestData = {
      username: user.username,
      oldPass: user.password,
      newPass: newPassword,
      authCode: authcode,
      client_transactionid: clientTxid,
      appname: user.appname,
    };

    const reqOpts = this.globalService.getHeaders(user.token, user.deviceId);
    console.log(requestData);
    console.log(reqOpts);
    return this.http.post<string>(SERVER_URL + 'changepassword', requestData, reqOpts)
    .pipe(map(data => {
      return data;
    }));
  }
}
