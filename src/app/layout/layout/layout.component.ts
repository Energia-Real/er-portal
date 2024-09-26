import { Component,  OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Subject } from 'rxjs';
import { AuthService } from '@app/auth/auth.service';


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit, OnDestroy{
  private onDestroy$ = new Subject<void>();
  public routeActive: string='';
  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {

      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          this.routeActive = this.router.url;
        }
      });
      
    
  }

  ngOnInit(): void {
    this.authService.getInfoUser().subscribe(role => {
      if (role.accessTo === 'BackOffice') {
        this.router.navigate(['backoffice-home'], { relativeTo: this.route });
      } else if (role.accessTo === 'Admin') {
        this.router.navigate(['admin-home'], { relativeTo: this.route });
      } else if (role.accessTo === 'Clients') {
        this.router.navigate(['client-home'], { relativeTo: this.route });
      } else if (role.accessTo === 'Billing') {
        this.router.navigate(['pricing'], { relativeTo: this.route });
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }

}
