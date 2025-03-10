import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Observable, Subject, Subscription, switchMap, take, takeUntil } from 'rxjs';
import packageJson from '../../../../../package.json';
import { setGeneralFilters } from '@app/core/store/actions/filters.actions';
import { Store } from '@ngrx/store';
import { EditNotificationStatus, FilterState, GeneralFilters, UserInfo } from '@app/shared/models/general-models';
import { selectFilterState } from '@app/core/store/selectors/filters.selector';
import { MatMenuTrigger } from '@angular/material/menu';
import { FormControl } from '@angular/forms';
import { NotificationService } from '@app/shared/services/notification.service';
import { Notification } from '@app/shared/models/general-models';
import { NotificationsState } from '@app/core/store/reducers/notifications.reducer';
import { updateNotifications } from '@app/core/store/actions/notifications.actions';
import { selectTopUnreadNotifications } from '@app/core/store/selectors/notifications.selector';
import { EncryptionService } from '@app/shared/services/encryption.service';
import { NOTIFICATION_CONSTANTS } from '@app/core/constants/notification-constants';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  private onDestroy$ = new Subject<void>();

  userInfo!: UserInfo;
  @Input() routeActive = '';
  @Output() monthSelected = new EventEmitter<{ month: string; year: number }>();
  @ViewChild(MatMenuTrigger) menuTrigger!: MatMenuTrigger;

  version = packageJson.version;

  years: { value: string }[] = [
    { value: '2024' },
    { value: '2025' },
  ];

  selectedYearSelect: any

  months = [
    { name: 'Jan', value: '01' }, { name: 'Feb', value: '02' }, { name: 'Mar', value: '03' },
    { name: 'Apr', value: '04' }, { name: 'May', value: '05' }, { name: 'Jun', value: '06' },
    { name: 'Jul', value: '07' }, { name: 'Aug', value: '08' }, { name: 'Sep', value: '09' },
    { name: 'Oct', value: '10' }, { name: 'Nov', value: '11' }, { name: 'Dec', value: '12' }
  ];

  selectedStartMonth: any = this.months[5];
  selectedEndMonth: any = this.months[6];

  generalFilters$!: Observable<GeneralFilters>;

  currentYear = new Date().getFullYear().toString().slice(-2);
  currentYearComplete = new Date().getFullYear();
  previousYearComplete = this.currentYearComplete - 1;
  selectedYear = this.currentYearComplete;
  selectedYearAbreviate = this.selectedYear.toString().slice(-2);
  selectedMonths: { name: string; value: string }[] = [];

  singleMonth = new FormControl(false);

  selectedStates: string[] = [];
  notifications: Notification[] = [];

  notificationSubscription!: Subscription;
  hasNotifications = false;

  menuOpen = false;

  ERROR = NOTIFICATION_CONSTANTS.ERROR_TYPE;

  constructor(
    private router: Router,
    private store: Store<{ filters: GeneralFilters, notifications: NotificationsState }>,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    private encryptionService: EncryptionService,

  ) {
    this.generalFilters$ = this.store.select(state => state.filters);
    this.router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => this.routeActive = this.router.url.split('?')[0]);
  }

  ngOnInit(): void {
    this.loadUserInfo();
    this.getFilters();
    this.updateLocalNotifications();
  }

  getFilters() {
    this.generalFilters$.subscribe((generalFilters: GeneralFilters) => {
      const startMonthValue = generalFilters.startDate.split('-')[1];
      const endMonthValue = generalFilters.endDate!.split('-')[1];

      this.selectedStartMonth = this.months.find(month => month.value === startMonthValue);
      this.selectedEndMonth = this.months.find(month => month.value === endMonthValue);
      this.selectedYearSelect = this.years.find(year => year.value === generalFilters.year);
    });
  }

  ngAfterViewInit(): void {
    this.singleMonth.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe((isSingleMonthSelected) => {
      if (isSingleMonthSelected) {
        this.selectedEndMonth = null;
        this.selectedMonths.pop()
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

  updateNotificationCenter() {
    this.notificationService.updateNotificationsCenter(this.userInfo.id).subscribe(resp => {
      this.store.dispatch(updateNotifications({ notifications: this.notificationService.getNotifications() }))
    });
  }

  selectStartMonth(month: { name: string; value: string }, menuTrigger: MatMenuTrigger): void {
    if (month.value == '12') {
      this.selectedEndMonth = null
      this.singleMonth.setValue(true);
      
    } else this.singleMonth.setValue(false);

    this.selectedStartMonth = month;
    menuTrigger.closeMenu();
  }

  selectEndMonth(month: { name: string; value: string }, menuTrigger: MatMenuTrigger): void {
    if (month.value > this.selectedStartMonth.value && !this.singleMonth.value) {
      this.selectedEndMonth = month;
      menuTrigger.closeMenu();
    }
  }

  updateYearSelected(year: number) {
    this.selectedYear = year;
    this.searchWithFilters();
    this.selectedYearAbreviate = this.selectedYear.toString().slice(-2);
  }

  searchWithFilters() {
    const generalFilters: any = {
      startDate: `${this.selectedYear}-${this.selectedStartMonth.value}-01`,
      year: this.selectedYearSelect?.value
    };

    generalFilters.endDate = this.singleMonth.value ? this.getLastDayOfMonth(this.selectedStartMonth.value) : `${this.selectedYear}-${this.selectedEndMonth.value}-01`

    this.store.select(selectFilterState).pipe(take(1)).subscribe((currentFiltersState: any) => {
      if (JSON.stringify(currentFiltersState.generalFilters) != JSON.stringify(generalFilters)) {
        this.store.dispatch(setGeneralFilters( generalFilters ));
        this.updateUrlWithFilters(generalFilters);
      }
    });
  }

  /**
   * Actualiza los parámetros de la URL basándose en los filtros proporcionados.
   */
  updateUrlWithFilters(generalFilters: { startDate: string; endDate: string | null; year: number }): void {
    const params = new URLSearchParams(window.location.search);

    if (generalFilters.startDate) params.set('startday', generalFilters.startDate);
    if (generalFilters.endDate) params.set('endday', generalFilters.endDate);
    else params.delete('endday');

    const currentUrl = this.router.url.split('?')[0];
    const newUrl = `${currentUrl}?${params.toString()}`;

    // Actualizar la URL solo si ha cambiado
    if (this.router.url !== newUrl) this.router.navigateByUrl(newUrl);
  }

  updateLocalNotifications() {
    this.notificationSubscription = this.store.select(selectTopUnreadNotifications).subscribe((notifications) => {
      this.notifications = notifications;
      this.hasNotifications = notifications.length > 0;
      this.cdr.detectChanges();
    });
  }

  trackByNotificationId(index: number, notification: Notification): string {
    return notification.externalId;
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

  signOut() {
    localStorage.removeItem('userEnergiaReal');
    localStorage.removeItem('generalFilters');
    this.router.navigate(['']);
  }

  getLastDayOfMonth = (dateStr: string): string => {
    const date = new Date(dateStr);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return lastDay.toISOString().split('T')[0];
  };


  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
