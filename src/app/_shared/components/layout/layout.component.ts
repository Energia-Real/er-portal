import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';

import { AccountService } from '@app/_services/account.service';
import { User } from '@app/_models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  userInfo: any = {};
  @Input() routeActive = '';

  constructor(private accountService: AccountService, private router: Router) {}

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
