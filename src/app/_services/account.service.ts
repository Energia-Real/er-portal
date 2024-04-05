import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@app/_models/user';
import { environment } from '@environment/environment';
import { BehaviorSubject, Observable, map } from 'rxjs';
import CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  public userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;

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
    return this.http.post<{}>(`${environment.API_URL_AUTH_V1}/${environment.APP}/login`, { email, password })
      .pipe(map(user => {
        console.log(user);
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
    let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwOi8vbG9jYWxob3N0OjQyMDAiLCJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjUwMDAiLCJleHAiOjE3MTE2MTY1MDUsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6InRlc3QyQHRlc3QuY29tIiwibmFtZWlkIjoiYzFjOWY0M2QtYmQ2My00OGFlLTg1OGMtYWI5NjI2ZmIzMTcwIiwianRpIjoiNzJlNjhmYmEtNmJlYS00NzFmLTgzZWItOGYyYjMxMmZlN2FlIiwiQXBwIjoiYmFja29mZmljZSIsIkNsaWVudGVzIjoiIiwiaWF0IjoxNzExMzU3MzA1LCJuYmYiOjE3MTEzNTczMDV9.BkQvjGAv-NXWGjfCVicz7nO9OIVGaTu6Oi5INbRzr6s";
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
    return this.http.get<any>(`${environment.API_URL_AUTH_V1}/usuario`, httpOptions);
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
