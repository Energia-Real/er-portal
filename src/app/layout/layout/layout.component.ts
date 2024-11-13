import { Component,  OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Subject } from 'rxjs';
import { AuthService } from '@app/auth/auth.service';
import { UserV2 } from '@app/shared/models/general-models';


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit, OnDestroy{
  private onDestroy$ = new Subject<void>();
  public routeActive: string='';
  userInfo!: UserV2;



  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {

    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.routeActive = this.router.url;
    });
      
    
  }

  ngOnInit(): void {
    this.authService.getInfoUser().subscribe(role => {
      console.log(role);
      
      this.userInfo = role
      if (this.router.url === '/er') {
        if (role.accessTo === 'BackOffice') {
          this.router.navigate(['backoffice-home'], { relativeTo: this.route });
        } else if (role.accessTo === 'Admin') {
          this.router.navigate(['admin-home'], { relativeTo: this.route });
        } else if (role.accessTo === 'Clients') {
          this.router.navigate(['client-home'], { relativeTo: this.route });
        } else if (role.accessTo === 'Billing') {
          this.router.navigate(['rates'], { relativeTo: this.route });
        } else {
          this.router.navigate(['/login']);
        }
      }
    });


  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }

}
