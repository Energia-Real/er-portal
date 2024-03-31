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
  userInfo: User | null = null;
  @Input() routeActive = '';

  constructor(private accountService: AccountService, private router: Router) {}

  ngOnInit(): void {
    this.getInfoUser();
  }

  signOut() {
    localStorage.removeItem('user');
    this.router.navigate(['/account/login']);
  }

  getInfoUser() {
    this.accountService?.user.subscribe(data => {
      console.log(data)
      this.userInfo = data;
    })
  }
}
