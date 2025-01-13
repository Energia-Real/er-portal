import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Subject } from 'rxjs';
import { AuthService } from '@app/auth/auth.service';
import { UserInfo } from '@app/shared/models/general-models';
import { NotificationService } from '@app/shared/services/notification.service';
import { EncryptionService } from '@app/shared/services/encryption.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();
  public routeActive: string = '';
  userInfo!: UserInfo;
  isSidebarHovered = false;
  keepOpen = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private encryptionService: EncryptionService,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.routeActive = this.router.url.split('?')[0]);
  }

  ngOnInit(): void {
    if (this.routeActive.includes('admin-home')) {
      console.log('es home no habilitar click');
    }

    this.notificationService.loadNotificationStatuses().subscribe();
    this.notificationService.loadNotificationTypes().subscribe();
    this.notificationService.loadNotificationCenterMessages().subscribe();

    this.authService.getInfoUser().subscribe(data => {
      this.userInfo = data;
      const encryptedData = this.encryptionService.encryptData(data);
      localStorage.setItem('userInfo', encryptedData);

      // Si la URL es '/er', redirigir dependiendo del acceso
      if (this.router.url === '/er') {
        switch (data.accessTo) {
          case 'BackOffice':
            this.router.navigate(['backoffice-home'], { relativeTo: this.route });
            break;
          case 'Admin':
            this.router.navigate(['admin-home'], { relativeTo: this.route });
            break;
          case 'Clients':
            this.router.navigate(['client-home'], { relativeTo: this.route });
            break;
          case 'Billing':
            this.router.navigate(['rates'], { relativeTo: this.route });
            break;
          default:
            this.router.navigate(['/login']);
            break;
        }
      }

      // Suscribirse a los parámetros de consulta para añadir filtros a la URL
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        const queryParams = this.route.snapshot.queryParams;
        const startday = queryParams['startday'];
        const endday = queryParams['endday'];

        if (startday && endday) {
          // Actualizar la URL con los filtros
          this.router.navigate([], {
            queryParams: { startday, endday },
            queryParamsHandling: 'merge', // Mantener los demás parámetros
          });
        }
      });
    });
  }

  onMouseEnter() {
    this.isSidebarHovered = true;
  }

  onMouseLeave() {
    this.isSidebarHovered = false;
  }

  signOut() {
    localStorage.removeItem('userEnergiaReal');
    localStorage.removeItem('userInfo');
    this.router.navigate(['']);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }
}
