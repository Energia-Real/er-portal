import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';

import { AccountService } from '@app/_services/account.service';
import { User } from '@app/_models/user';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  userInfo: User | null = null;
  @Input() routeActive = '';

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.getInfoUser();
  }

  signOut() {
    window.location.href = '/';
  }

  getInfoUser() {
    this.accountService?.user.subscribe(data => {
      console.log(data)
      this.userInfo = data;
    })
  }
}
