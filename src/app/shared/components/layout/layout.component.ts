import { Component, Input } from '@angular/core';

import * as entityGeneral from '../../models/general-models';
import { Router } from '@angular/router';
import { AuthService } from '@app/auth/auth.service';

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
export class LayoutComponent {
  userInfo: any = {};
  @Input() routeActive = '';

  version : string = '1.0.0'

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
}
