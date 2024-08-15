import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as entityGeneral from '../shared/models/general-models';

import { environment } from '@environment/environment';
import { BehaviorSubject, Observable, map } from 'rxjs';
import CryptoJS from 'crypto-js';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public userSubject: BehaviorSubject<entityGeneral.User | null>;
  public user: Observable<entityGeneral.User | null>;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject(this.getDecryptedUser());
    this.user = this.userSubject.asObservable();
  }

  public get userValue() {
    return this.userSubject.value;
  }

  login(email: string, password: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      })
    };

    return this.http.post<{}>(`${environment.API_URL_AUTH_V1}/login`, { email, password }, httpOptions)
      .pipe(map(user => {
        const encryptedUser = CryptoJS.AES.encrypt(JSON.stringify(user), 'secretKey').toString();
        localStorage.setItem('userEnergiaReal', encryptedUser);
        this.userSubject.next(user);
        return user;
      }));
  }

  register(data: any): Observable<any> {
    return this.http.post<any>(`${environment.API_URL_AUTH_V1}/${environment.APP}/registro`, data);
  }

  getInfoUser(): Observable<any> {
    let dataUser = this.getDecryptedUser();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${dataUser.token}`
      })
    };
    return this.http.get<any>(`${environment.API_URL_AUTH_V1}/usuario`, httpOptions);
  }

  forgotPassword(email: string): Observable<any> {
    const url = `${environment.API_URL_AUTH_V2}/ForgotPassword?email=${email}`;

    return this.http.post<any>(url, null);
  }

  resetyPassword(data: any): Observable<any> {
    const url = `${environment.API_URL_AUTH_V2}/ResetPassword`;

    return this.http.post<any>(url, data);
  }

  getDecryptedUser() {
    const encryptedUser = localStorage.getItem('userEnergiaReal');

    if (encryptedUser) {
      const decryptedBytes = CryptoJS.AES.decrypt(encryptedUser, 'secretKey');
      const decryptedUser = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
      return decryptedUser;
    }
  }
}
