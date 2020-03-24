import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Md5 } from 'ts-md5';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  private userData = new BehaviorSubject<string>(null);
  checkUser$ = this.userData.asObservable();
  constructor(private auth: AuthenticationService) { }

  getUserData(data: any) {
    this.userData.next(data);
  }

  getHeaders(tokenID, deviceID) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS, DELETE, PATCH',
        Accept: 'application/json',
        token: tokenID,
        deviceid: deviceID
      }),
      observe: 'response' as 'body'
    };
    return httpOptions;
  }

  getUserDetails(data: any) {
    const userDetail = {} as any;
    for (const i of data) {
      userDetail.username = i.username;
      userDetail.password = i.password;
      userDetail.token = i.token;
      userDetail.deviceId = i.device_id;
      userDetail.appname = i.appname;
      userDetail.partnerID = i.partnerid;
    }
    return userDetail;
  }

  XORencoder(md5Val: any, rrn: any) {
    let result = '';

    for (let i = 0; i < md5Val.length; i++) {
        // tslint:disable-next-line: no-bitwise
        result += String.fromCharCode(md5Val.charCodeAt(i) ^ rrn.charCodeAt(i % rrn.length));
    }
    const finalResult = this.b64EncodeUnicode(result);
    return finalResult;
  }

  b64EncodeUnicode(str: any) {
    // first we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
      return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        // function toSolidBytes(match, p1) {
        (match, p1) => {
          // console.debug('match: ' + match);
          return String.fromCharCode(('0x' + p1) as any);
        }));
  }

  createAuthCode(username, password, rrn) {
    const stepA = Md5.hashStr(username + password);
    const stepB = Md5.hashStr(rrn);
    const stepC = this.XORencoder(stepA, stepB);
    const result = Md5.hashStr(stepC);
    return result;
  }
}
