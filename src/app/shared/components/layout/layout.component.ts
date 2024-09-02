import { Component, Input, OnDestroy } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '@app/auth/auth.service';
import { Subject } from 'rxjs';
import packageJson from '../../../../../package.json';

interface User {
  id: string,
  email: string,
  persona: {
      id: string,
      nombres: string,
      apellidos: string
  },
  clientes: null,
  accessTo: string
}
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnDestroy {
  private onDestroy$ = new Subject<void>();

  userInfo: any = {};
  @Input() routeActive = '';

  version = packageJson.version;

  constructor(private accountService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.getInfoUser();
  }

  signOut() {
    localStorage.removeItem('userEnergiaReal');
    this.router.navigate(['/account/login']);
  }

  getInfoUser(){
    this.accountService.getInfoUser().subscribe((data:User) => {
      this.userInfo = data;
    })
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }
}
