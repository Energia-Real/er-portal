import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter, Observable, Subject, switchMap, take, takeUntil } from 'rxjs';
import packageJson from '../../../../../package.json';
import { setGeneralFilters } from '@app/core/store/actions/filters.actions';
import { Store } from '@ngrx/store';
import { EditNotificationStatus, GeneralFilters, MonthsFilters, UserInfo } from '@app/shared/models/general-models';
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

  months: MonthsFilters[] = [
    { name: 'Jan', value: '01' }, { name: 'Feb', value: '02' }, { name: 'Mar', value: '03' },
    { name: 'Apr', value: '04' }, { name: 'May', value: '05' }, { name: 'Jun', value: '06' },
    { name: 'Jul', value: '07' }, { name: 'Aug', value: '08' }, { name: 'Sep', value: '09' },
    { name: 'Oct', value: '10' }, { name: 'Nov', value: '11' }, { name: 'Dec', value: '12' }
  ];

  selectedStartMonth: MonthsFilters | any = this.months[5];
  selectedEndMonth: MonthsFilters | null = this.months[6];

  generalFilters$!: Observable<GeneralFilters>;
  currentMonth: any = new Date().getMonth() + 1; // Mes actual (Enero = 1, Diciembre = 12)

  currentYearFull: any = new Date().getFullYear().toString()
  currentYear: string = new Date().getFullYear().toString().slice(-2);
  currentYearComplete: number = new Date().getFullYear();
  previousYearComplete: number = this.currentYearComplete - 1;
  selectedYear: number = this.currentYearComplete;
  selectedYearAbreviate: string = this.selectedYear.toString().slice(-2);
  selectedMonths: { name: string; value: string }[] = [];

  singleMonth = new FormControl(false);

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
    this.generalFilters$.pipe(takeUntil(this.onDestroy$))
      .subscribe((generalFilters: GeneralFilters) => {
        const startMonthValue = generalFilters.startDate.split('-')[1];
        const endMonthValue = generalFilters.endDate.split('-')[1];

        this.selectedStartMonth = this.months.find(month => month.value == startMonthValue)!;
        this.selectedEndMonth = this.months.find(month => month.value == endMonthValue)!;
        this.selectedYearSelect = this.years.find(year => year.value == generalFilters.year);
        this.selectedYearAbreviate = generalFilters.startDate.split("-")[0].toString().slice(-2)
        this.selectedYear = parseFloat(generalFilters.startDate.split("-")[0])
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

  updateNotificationCenter() {
    this.notificationService.updateNotificationsCenter(this.userInfo.id).subscribe(() => {
      this.store.dispatch(updateNotifications({ notifications: this.notificationService.getNotifications() }))
    });
  }

  selectStartMonth(month: MonthsFilters, menuTrigger: MatMenuTrigger): void {
    if (month.value == '12') {
      this.selectedEndMonth = null;
      this.singleMonth.setValue(true);

    } else this.singleMonth.setValue(false);

    this.selectedStartMonth = month;
    menuTrigger.closeMenu();
  }

  selectEndMonth(month: MonthsFilters, menuTrigger: MatMenuTrigger): void {
    if (this.selectedStartMonth && month.value > this.selectedStartMonth.value && !this.singleMonth.value) {
      this.selectedEndMonth = month;
      menuTrigger.closeMenu();
    }
  }

  updateYearSelected(year: number) {
    const prevStartMonth = this.selectedStartMonth;
    const prevEndMonth = this.selectedEndMonth;
    
    // Actualiza el año seleccionado
    this.selectedYear = year;
    this.selectedYearAbreviate = this.selectedYear.toString().slice(-2);
  
    // Asigna enero y el mes actual si al cambiar de un año distinto al actual los meses no estan disponibles entonces pone enero en fecha inicio y mes actual en fecha fin
    const assignDefaultMonths = () => {
      this.selectedStartMonth = this.months.find((m) => m.value == '01');
      this.selectedEndMonth = this.months.find((m) => m.value == String(this.currentMonth).padStart(2, '0'))!
      this.singleMonth.setValue(false);
    };
  
    // Valida si los meses seleccionados estan dentro del rango permitido
    const areMonthsValid = (start: any, end: any, currentYear: boolean) => {
      const startMonthValue = start.value;
      const endMonthValue = end.value;
      const maxMonth = currentYear ? String(this.currentMonth).padStart(2, '0') : '12';
      return startMonthValue >= '01' && startMonthValue <= maxMonth && endMonthValue >= '01' && endMonthValue <= maxMonth;
    };
  
    // Si el año seleccionado es el actual
    if (year == this.currentYearFull) {
      if (areMonthsValid(prevStartMonth, prevEndMonth, true)) {
        // Mantener los meses previos seleccionados si estan dentro del rango
        this.selectedStartMonth = prevStartMonth;
        this.selectedEndMonth = prevEndMonth;
      } else {
        // Asignar meses predeterminados enero y mes actual
        assignDefaultMonths();
      }
    } else {
      // Si el año seleccionado es distinto al actual
      if (areMonthsValid(prevStartMonth, prevEndMonth, false)) {
        this.selectedStartMonth = prevStartMonth;
        this.selectedEndMonth = prevEndMonth;
      } else {
        assignDefaultMonths();
      }
    }
  }

  searchWithFilters() {
    const generalFilters: GeneralFilters = {
      startDate: `${this.selectedYear}-${this.selectedStartMonth.value}-01`,
      year: this.selectedYearSelect?.value,
      endDate: ''
    };

    generalFilters.endDate = !this.selectedEndMonth ? this.getLastDayOfMonth(this.selectedYear, +this.selectedStartMonth.value) : this.getLastDayOfMonth(this.selectedYear, +this.selectedEndMonth.value);

    this.store.select(selectFilterState).pipe(take(1)).subscribe((currentFiltersState: any) => {
      if (JSON.stringify(currentFiltersState.generalFilters) != JSON.stringify(generalFilters)) {
        this.store.dispatch(setGeneralFilters({ generalFilters }));
        this.updateUrlWithFilters(generalFilters);
      }
    });
  }

  /**
   * Actualiza los parámetros de la URL basándose en los filtros proporcionados.
   */
  updateUrlWithFilters(generalFilters: GeneralFilters): void {
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
    this.store.select(selectTopUnreadNotifications).pipe(takeUntil(this.onDestroy$)).subscribe((notifications) => {
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

  getLastDayOfMonth(year: number, month: number): string {
    const lastDay = new Date(year, month, 0).getDate();
    return `${year}-${month.toString().padStart(2, '0')}-${lastDay}`;
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
    localStorage.removeItem('generalFilters');
    this.router.navigate(['']);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
