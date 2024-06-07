import { Component, Input } from '@angular/core';

import * as entityGeneral from '../../models/general-models';
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
    console.log('routeActive', this.routeActive);
    
  }

  signOut() {
    localStorage.removeItem('userEnergiaReal');
    this.router.navigate(['/account/login']);
  }

  getInfoUser(){
    this.accountService.getInfoUser().subscribe(data => {
      console.log(data);
      
      this.userInfo = data.persona;
      console.log(this.userInfo);
      
    })
  }
}
