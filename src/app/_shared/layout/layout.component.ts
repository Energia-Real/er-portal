import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { AccountService } from '@app/_services/account.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  userInfo: any = {};

  constructor(private location: Location, private accountService: AccountService) {}

  ngOnInit(): void {
    this.getInfoUser();
  }

  signOut() {
    window.location.href = '/';
  }

  getInfoUser() {
    this.accountService?.user.subscribe(data => {
      this.userInfo = data;
      console.log(this.userInfo);
    })
  }
}
