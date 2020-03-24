import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../_models/user';
import { map, timeout } from 'rxjs/operators';
import { SERVER_URL } from 'src/environments/environment';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
      this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
      this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(data: any) {

    const reqOpts = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS, DELETE, PATCH',
        Accept: 'application/json',
      })
    };

    return this.http.post<any>(SERVER_URL + 'login', data, reqOpts)
        .pipe(map(user => {
           const userDetails = user['data'.toString()];
           if (userDetails !== undefined) {
            for (const i of userDetails) {
                i.device_id = data.device_id;
                i.password = data.password;
            }
           }
           console.log(user);
           const expiresAt = moment().add('300', 'second');
           // store user details and jwt token in local storage to keep user logged in between page refreshes
           localStorage.setItem('currentUser', JSON.stringify(user));
           localStorage.setItem('expiration', JSON.stringify(expiresAt));
           this.currentUserSubject.next(user);
           return user;
        }));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('expiration');
    this.currentUserSubject.next(null);
  }

  public isExpired() {
    return moment().isBefore(this.getExpiration());
  }

  getExpiration() {
    const expiration = localStorage.getItem('expiration');
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }
}
