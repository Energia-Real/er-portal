import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@app/auth/auth.service';
import { distinctUntilChanged, Subject, Subscription, switchMap, take, takeUntil } from 'rxjs';
import packageJson from '../../../../../package.json';
import { setGeneralFilters, setFiltersBatu, setFiltersSolarCoverage, setFilters } from '@app/core/store/actions/filters.actions';
import { Store } from '@ngrx/store';
import { EditNotificationStatus, FilterState, UserInfo } from '@app/shared/models/general-models';
import { selectFilters, selectFilterState } from '@app/core/store/selectors/filters.selector';
import { MatMenuTrigger } from '@angular/material/menu';
import { FormControl } from '@angular/forms';
import { NotificationService } from '@app/shared/services/notification.service';
import{Notification}from '@app/shared/models/general-models';
import { NotificationsState } from '@app/core/store/reducers/notifications.reducer';
import { updateNotifications } from '@app/core/store/actions/notifications.actions';
import { selectTopUnreadNotifications } from '@app/core/store/selectors/notifications.selector';
import { EncryptionService } from '@app/shared/services/encryption.service';


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

  months = [
    { name: 'Jan', value: '01' }, { name: 'Feb', value: '02' }, { name: 'Mar', value: '03' },
    { name: 'Apr', value: '04' }, { name: 'May', value: '05' }, { name: 'Jun', value: '06' },
    { name: 'Jul', value: '07' }, { name: 'Aug', value: '08' }, { name: 'Sep', value: '09' },
    { name: 'Oct', value: '10' }, { name: 'Nov', value: '11' }, { name: 'Dec', value: '12' }
  ];

  selectedStartMonth = this.months[5];
  selectedEndMonth: any = this.months[6];

  currentYear = new Date().getFullYear().toString().slice(-2);
  currentYearComplete = new Date().getFullYear();
  previousYearComplete = this.currentYearComplete - 1;
  selectedYear= this.currentYearComplete;
  selectedYearAbreviate = this.selectedYear.toString().slice(-2);
  selectedMonths: { name: string; value: string }[] = [];

  singleMonth = new FormControl(false);

  selectedStates: string[] = [];
  notifications: Notification[] = [];

   notificationSubscription!: Subscription  ;
   hasNotifications = false;

   menuOpen = false;

  constructor(
    private router: Router,
    private store: Store<{ filters: FilterState,notifications: NotificationsState }>,
    private  notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    private encryptionService: EncryptionService
  ) {}

  ngOnInit(): void {
    this.loadUserInfo();
    this.subscribeToFilters();
    this.updateLocalNotifications();
  }

  ngAfterViewInit(): void {
    this.singleMonth.valueChanges.pipe(takeUntil(this.onDestroy$)).subscribe((isSingleMonthSelected) => {
      if (isSingleMonthSelected) {
        this.selectedEndMonth = null;
        this.selectedMonths.pop()
        this.searchWithFilters();
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

  updateNotificationCenter(){
    this.notificationService.updateNotificationsCenter(this.userInfo.id).subscribe(resp=>{
      this.store.dispatch(updateNotifications({ notifications:this.notificationService.getNotifications()}))
    });
  }

  subscribeToFilters() {
    this.store.select(selectFilters).pipe(
        distinctUntilChanged((prev, curr) => JSON.stringify(prev?.months) == JSON.stringify(curr?.months)),
        takeUntil(this.onDestroy$)
      ).subscribe((filtersState) => {
        if (filtersState && filtersState?.months?.length) {
          const formattedMonths = this.formatSelectedMonths();
          
          if (JSON.stringify(filtersState.months) !== JSON.stringify(formattedMonths)) {
            this.selectedMonths = this.months.filter(month => filtersState?.months.includes(`${this.selectedYear}-${month.value}-01`));
            this.updateStartAndEndMonth();
          }
        } else this.setDefaultMonths();
      });
  }
  
  setDefaultMonths() {
    this.selectedStartMonth = this.months[5];
    this.selectedEndMonth = this.months[6];
    this.updateSelectedMonths();
  }

  selectStartMonth(month: { name: string; value: string }, menuTrigger: MatMenuTrigger): void {
    this.selectedStartMonth = month;
    this.updateSelectedMonths();
    menuTrigger.closeMenu();
  }

  selectEndMonth(month: { name: string; value: string }, menuTrigger: MatMenuTrigger): void {
    if (!this.singleMonth.value) {
      this.selectedEndMonth = month;
      this.updateSelectedMonths();
      menuTrigger.closeMenu();
    }
  }

  updateStartAndEndMonth() {
    if (this.selectedMonths.length) {
      this.selectedStartMonth = this.selectedMonths[0];
      this.selectedEndMonth = this.selectedMonths[this.selectedMonths.length - 1];
    }
  }

  updateYearSelected(year: number){
    this.selectedYear=year;
    this.searchWithFilters();
    this.selectedYearAbreviate = this.selectedYear.toString().slice(-2);

  }

  updateSelectedMonths() {
    if (this.selectedStartMonth && this.selectedEndMonth) {
      const startIndex = this.months.findIndex(m => m.value === this.selectedStartMonth.value);
      const endIndex = this.months.findIndex(m => m.value === this.selectedEndMonth.value);
      this.selectedMonths = this.months.slice(
        Math.min(startIndex, endIndex),
        Math.max(startIndex, endIndex) + 1
      );
    }
    this.searchWithFilters();
  }

  formatSelectedMonths(): string[] {
    return this.selectedMonths.map(month => `${this.selectedYear}-${month.value}-01`);
  }

  searchWithFilters() {
    if (this.selectedMonths.length > 0) {
      const formattedMonths = this.formatSelectedMonths();
      const generalFilters = {
        startDate: `${this.selectedYear}-${this.selectedStartMonth.value}-01`,
        endDate: this.singleMonth.value ? null : `${this.selectedYear}-${this.selectedEndMonth.value}-01`
      };
  
      const filters = { requestType: 'Month', months: formattedMonths };
      const filtersBatu = { months: this.selectedMonths.map(month => `${this.selectedYear}-${month.value}`) };
      const filtersSolarCoverage = {
        brand: "huawei",
        clientName: "Merco",
        requestType: 2,
        months: formattedMonths
      };
  
      this.store.select(selectFilterState).pipe(take(1)).subscribe((currentFiltersState:any) => {        
        if (JSON.stringify(currentFiltersState.generalFilters) != JSON.stringify(generalFilters)) this.store.dispatch(setGeneralFilters({ generalFilters }));
        if (JSON.stringify(currentFiltersState.filters) != JSON.stringify(filters)) this.store.dispatch(setFilters({ filters }));  
        if (JSON.stringify(currentFiltersState.filtersBatu) != JSON.stringify(filtersBatu)) this.store.dispatch(setFiltersBatu({ filtersBatu }));
        if (JSON.stringify(currentFiltersState.filtersSolarCoverage) != JSON.stringify(filtersSolarCoverage)) this.store.dispatch(setFiltersSolarCoverage({ filtersSolarCoverage }));
      });
    }
  }
  
  signOut() {
    localStorage.removeItem('userEnergiaReal');
    this.router.navigate(['']);
  }

  updateLocalNotifications(){
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

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
