import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({ templateUrl: './layout.component.html' })
export class LayoutComponent {

  constructor(
    private router: Router,
    private accountService: AuthService
  ) {
    if (this.accountService.userValue) this.router.navigate(['/']);
  }
}
