import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GeneralFilters, notificationData, UserInfo } from '@app/shared/models/general-models';
import { EncryptionService } from '@app/shared/services/encryption.service';
import { Store } from '@ngrx/store';
import { combineLatest, distinctUntilChanged, Observable, Subject, takeUntil } from 'rxjs';
import { BillingService } from '../billing.service';
import { NotificationDataService } from '@app/shared/services/notificationData.service';
import { NotificationComponent } from '@app/shared/components/notification/notification.component';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-billing-overview',
  templateUrl: './billing-overview.component.html',
  styleUrl: './billing-overview.component.scss',
  standalone: false
})
export class BillingOverviewComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();


  generalFilters$!: Observable<GeneralFilters>;
  generalFilters!: GeneralFilters
  userInfo!: UserInfo;

  constructor(
    private store: Store<{ filters: GeneralFilters }>,
    private dialog: MatDialog,
    private fb: FormBuilder,
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

