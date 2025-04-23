import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as entity from '../billing-model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DrawerGeneral, GeneralFilters, notificationData, UserInfo } from '@app/shared/models/general-models';
import { EncryptionService } from '@app/shared/services/encryption.service';
import { Store } from '@ngrx/store';
import { combineLatest, distinctUntilChanged, Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { BillingService } from '../billing.service';
import { selectPageIndex, selectPageSize } from '@app/core/store/selectors/paginator.selector';
import { updateDrawer } from '@app/core/store/actions/drawer.actions';
import { selectDrawer } from '@app/core/store/selectors/drawer.selector';
import { MatSelectChange } from '@angular/material/select';
import { NotificationDataService } from '@app/shared/services/notificationData.service';
import { NotificationComponent } from '@app/shared/components/notification/notification.component';

@Component({
  selector: 'app-billing-overview',
  templateUrl: './billing-overview.component.html',
  styleUrl: './billing-overview.component.scss'
})
export class BillingOverviewComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();

  generalFilters$!: Observable<GeneralFilters>;

  generalFilters!: GeneralFilters
  userInfo!: UserInfo;

  constructor(
    private store: Store<{ filters: GeneralFilters }>,
    private dialog: MatDialog,
    private notificationDataService: NotificationDataService,
    private encryptionService: EncryptionService,
    private moduleServices: BillingService
  ) {
    this.generalFilters$ = this.store.select(state => state.filters);

    combineLatest([
      this.generalFilters$.pipe(distinctUntilChanged()),
    ])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(([generalFilters]) => {
        this.generalFilters = generalFilters;
      });
  }

  ngOnInit(): void {
    this.getUserClient();
  }

  getUserClient() {
    const encryptedData = localStorage.getItem('userInfo');
    if (encryptedData) this.userInfo = this.encryptionService.decryptData(encryptedData);
  }

  alertInformationModal() {
    const dataNotificationModal: notificationData = this.notificationDataService.showNoClientIdAlert();

    this.dialog.open(NotificationComponent, {
      width: '540px',
      data: dataNotificationModal
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}

