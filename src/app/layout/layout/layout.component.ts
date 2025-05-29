import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, Subject, takeUntil } from 'rxjs';
import { AuthService } from '@app/auth/auth.service';
import { UserInfo } from '@app/shared/models/general-models';
import { NotificationService } from '@app/shared/services/notification.service';
import { EncryptionService } from '@app/shared/services/encryption.service';
import { Module } from '@app/layout/layout/modules.interface';
import { TranslationService } from '@app/shared/services/i18n/translation.service';

declare const pendo: any;

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.scss',
    standalone: false
})
export class LayoutComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();
  public routeActive: string = '';
  userInfo!: UserInfo;
  isSidebarHovered: boolean = false;
  keepOpen: boolean = false;
  modules: Module[] = []; // Lista de módulos dinámicos

  constructor(
    private router: Router,
    private authService: AuthService,
    private encryptionService: EncryptionService,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    public translationService: TranslationService
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd), takeUntil(this.onDestroy$))
      .subscribe(() => (this.routeActive = this.router.url.split('?')[0]));
  }

  ngOnInit(): void {
    const hasReloaded = localStorage.getItem('homeComponentReloaded');
    this.notificationService.loadNotificationStatuses().subscribe();
    this.notificationService.loadNotificationTypes().subscribe();
    this.notificationService.loadNotificationCenterMessages().subscribe();
    if (!hasReloaded) {
      localStorage.setItem('homeComponentReloaded', 'true');
      setTimeout(() => {
        window.location.reload();
      }, 300); // Pequeño delay para asegurar que el componente se inicialice
    }

    // Try to load user info from localStorage first (for offline support)
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      try {
        this.userInfo = this.encryptionService.decryptData(storedUserInfo);
        // Check if there's a language preference stored
        const storedLanguage = localStorage.getItem('userLanguage');
        if (storedLanguage) {
          this.translationService.setLanguage(storedLanguage);
        }
        this.initializePendoIfAvailable();
        this.loadModulesFromAPI();
        this.handleRouteNavigation();
      } catch (error) {
        console.error('Error loading stored user info:', error);
      }
    }

    // Then try to get fresh data from the API
    this.authService.getInfoUser().subscribe({
      next: (data) => {
        this.userInfo = data;
        // Store user's preferred language if available
        const preferredLanguage = localStorage.getItem('userLanguage') || 'es-MX';
        this.translationService.setLanguage(preferredLanguage);
        localStorage.setItem('userLanguage', preferredLanguage);
        this.initializePendoIfAvailable();
        const encryptedData = this.encryptionService.encryptData(data);
        localStorage.setItem('userInfo', encryptedData);
        this.loadModulesFromAPI();
        this.handleRouteNavigation();
      },
      error: (err) => {
        console.error('Error fetching user info:', err);
        // If we already loaded from localStorage, we can continue
        // If not, we might need to redirect to login
        if (!this.userInfo) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  initializePendoIfAvailable(): void {
    if (this.userInfo && typeof pendo !== 'undefined') {
      pendo.initialize({  
        visitor: {
          id: this.userInfo.email,
          firstName: this.userInfo?.persona?.nombres || '',
          lastName: this.userInfo?.persona?.apellidos || ''
        }, 
        account: { 
          id: this.userInfo?.pendoIntegration?.clientID || '', 
          name: this.userInfo?.pendoIntegration?.clientName || '', 
        }
      });
    } else if (typeof pendo === 'undefined') {
      console.error('Pendo no está definido. Asegúrate de que el script está cargado en index.html.');
    }
  }

  loadModulesFromAPI(): void {
    this.authService.getModules().subscribe((modules) => this.modules = modules);
  }

  handleRouteNavigation(): void {
    if (this.router.url === '/er' && this.userInfo) {
      switch (this.userInfo.accessTo) {
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

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const queryParams = this.route.snapshot.queryParams;
        const startday = queryParams['startday'];
        const endday = queryParams['endday'];

        if (startday && endday) {
          this.router.navigate([], {
            queryParams: { startday, endday },
            queryParamsHandling: 'merge',
          });
        }
      });
  }

  onMouseEnter(): void {
    this.isSidebarHovered = true;
  }

  onMouseLeave(): void {
    this.isSidebarHovered = false;
  }

  signOut(): void {
    localStorage.removeItem('userEnergiaReal');
    localStorage.removeItem('userInfo');
    this.router.navigate(['']);
  }

  ngOnDestroy(): void {
    localStorage.removeItem('homeComponentReloaded');
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
