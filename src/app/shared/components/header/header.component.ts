import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Subject, switchMap, takeUntil } from 'rxjs';
import packageJson from '../../../../../package.json';
import { Store } from '@ngrx/store';
import { EditNotificationStatus, GeneralFilters, UserInfo } from '@app/shared/models/general-models';
import { NotificationService } from '@app/shared/services/notification.service';
import { Notification } from '@app/shared/models/general-models';
import { NotificationsState } from '@app/core/store/reducers/notifications.reducer';
import { updateNotifications } from '@app/core/store/actions/notifications.actions';
import { selectTopUnreadNotifications } from '@app/core/store/selectors/notifications.selector';
import { EncryptionService } from '@app/shared/services/encryption.service';
import { NOTIFICATION_CONSTANTS } from '@app/core/constants/notification-constants';
import { ConfigGlobalFilters } from '../global-filters/global-filters-model';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: false
})
export class HeaderComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();
  version = packageJson.version;

  configGlobalFilters: ConfigGlobalFilters = {
    showDatepicker: true,
    showYears: false
  }

  userInfo!: UserInfo;

  @Input() routeActive = '';

  selectedStates: string[] = [];
  notifications: Notification[] = [];

  hasNotifications: boolean = false;
  menuOpen: boolean = false;

  ERROR = NOTIFICATION_CONSTANTS.ERROR_TYPE;

  constructor(
    private router: Router,
    private store: Store<{ filters: GeneralFilters, notifications: NotificationsState }>,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    private encryptionService: EncryptionService,

  ) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      this.routeActive = this.router.url.split('?')[0];
      this.updateConfigGlobalFilters();
    });
  }

  ngOnInit(): void {
    this.loadUserInfo();
    this.updateLocalNotifications();
  }

  updateConfigGlobalFilters() {
    if (this.routeActive.includes('energy')) this.configGlobalFilters = { showDatepicker: false, showYears: true }
    else this.configGlobalFilters = { showDatepicker: true, showYears: false }
  }

  updateLocalNotifications() {
    this.store.select(selectTopUnreadNotifications).pipe(takeUntil(this.onDestroy$)).subscribe((notifications) => {
      this.notifications = notifications;
      this.hasNotifications = notifications.length > 0;
      this.cdr.detectChanges();
    });
  }

  removeNotification(notificationToRemove: Notification): void {
    const readedNotification: EditNotificationStatus = {
      externalId: notificationToRemove.externalId,
      readed: true
    };

    this.notifications = this.notifications.filter(notification => notification !== notificationToRemove);

    this.notificationService.updateNotification(readedNotification).pipe(
      switchMap(() => this.notificationService.updateNotificationsCenter(this.userInfo.id))
    ).subscribe({
      next: resp => {
        this.store.dispatch(updateNotifications({ notifications: this.notificationService.getNotifications() }));
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Error actualizando las notificaciones:', err);
      }
    });
  }

  loadUserInfo() {
    const encryptedData = localStorage.getItem('userInfo');
    if (encryptedData) {
      this.userInfo = this.encryptionService.decryptData(encryptedData);
      this.updateNotificationCenter()
    }
  }

  signOut() {
    localStorage.removeItem('userEnergiaReal');
    this.router.navigate(['']);
  }

  updateNotificationCenter() {
    this.notificationService.updateNotificationsCenter(this.userInfo.id).subscribe(() => {
      this.store.dispatch(updateNotifications({ notifications: this.notificationService.getNotifications() }))
    });
  }

  trackByNotificationId(index: number, notification: Notification): string {
    return notification.externalId;
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
