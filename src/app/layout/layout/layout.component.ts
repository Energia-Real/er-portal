import { Component,  OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Subject } from 'rxjs';
import { AuthService } from '@app/auth/auth.service';
import { NotificationService } from '@app/shared/services/notification.service';


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
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {

    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.routeActive = this.router.url;
    });
      
    
  }

  ngOnInit(): void {
    this.notificationService.loadNotificationStatuses().subscribe();
    this.notificationService.loadNotificationTypes().subscribe();
    this.notificationService.loadNotificationCenterMessages().subscribe(resp=>{
    });
    this.authService.getInfoUser().subscribe(role => {
      
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
