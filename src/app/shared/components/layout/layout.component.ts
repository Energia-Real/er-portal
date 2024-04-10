import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';

import * as entityGeneral from '../../../shared/models/general-interface';
import { Router } from '@angular/router';
import { AuthService } from '@app/auth/auth.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  userInfo: any = {};
  @Input() routeActive = '';

  constructor(private accountService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.getInfoUser();
  }

  signOut() {
    localStorage.removeItem('user');
    this.router.navigate(['/account/login']);
  }

  getInfoUser(){
    this.accountService.getInfoUser().subscribe(data => {
      this.userInfo = data.persona;
      console.log(this.userInfo);
    })
  }
}
