import { AfterViewChecked, AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as entity from '../billing-model';
import { combineLatest, debounceTime, distinctUntilChanged, Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Store } from '@ngrx/store';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import { Router } from '@angular/router';
import { BillingService } from '../billing.service';
import { selectPageIndex, selectPageSize } from '@app/core/store/selectors/paginator.selector';
import { FormControl } from '@angular/forms';
import { updatePagination } from '@app/core/store/actions/paginator.actions';
import { GeneralFilters, notificationData, UserInfo } from '@app/shared/models/general-models';
import { PeriodicElement } from '@app/pages/plants-main/plants-model';
import { SelectionModel } from '@angular/cdk/collections';
import { EncryptionService } from '@app/shared/services/encryption.service';
import { NotificationDataService } from '@app/shared/services/notificationData.service';
import { NOTIFICATION_CONSTANTS } from '@app/core/constants/notification-constants';
import { MatDialog } from '@angular/material/dialog';
import { NotificationComponent } from '@app/shared/components/notification/notification.component';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-previous-billing',
    templateUrl: './previous-billing.component.html',
    styleUrl: './previous-billing.component.scss',
    standalone: false
})
export class PreviousBillingComponent implements OnDestroy, OnInit, AfterViewChecked, AfterViewInit {
  ADD = NOTIFICATION_CONSTANTS.ADD_CONFIRM_TYPE;
  CANCEL = NOTIFICATION_CONSTANTS.CANCEL_TYPE;

  private onDestroy$ = new Subject<void>();

  generalFilters$!: Observable<GeneralFilters>;

  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageSize: number = 10;
  pageIndex: number = 1;
  totalItems: number = 0;
  displayedColumns: string[] = [
    'checkbox',
    'rpu',
    'clientName',
    'status',
    'plantName',
    'year',
    'month',
    'energyGeneration',
    'rate',
    'amount',
    'amountWithIva',
    'actions',
  ];
  pageSizeSub!: Subscription;
  pageIndexSub!: Subscription;
  selection = new SelectionModel<PeriodicElement>(true, []);

  allRowsInit: boolean = false;

  formatTimer: any;

  modifiedElements: any[] = [];

  searchBar = new FormControl('');

  generalFilters!: GeneralFilters
  userInfo!: UserInfo;

  oneConfirmInvoice!: entity.DataBillingTable;

  ngAfterViewChecked() {
    if (this.paginator) this.paginator.pageIndex = this.pageIndex - 1;
    else console.error('Paginator no está definido');
  }

  constructor(
    private store: Store<{ filters: GeneralFilters }>,
    private notificationService: OpenModalsService,
    private router: Router,
    private dialog: MatDialog,
    private notificationDataService: NotificationDataService,
    private encryptionService: EncryptionService,
    private moduleServices: BillingService,
  ) {
    this.generalFilters$ = this.store.select(state => state.filters);

    combineLatest([
      this.generalFilters$.pipe(distinctUntilChanged()),
      this.store.select(selectPageSize).pipe(distinctUntilChanged()),
      this.store.select(selectPageIndex).pipe(distinctUntilChanged())
    ])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(([generalFilters, pageSize, pageIndex]) => {
        this.generalFilters = generalFilters;
        this.pageSize = pageSize;
        this.pageIndex = pageIndex + 1;

        if (this.paginator) {
          this.paginator.pageSize = pageSize;
          this.paginator.pageIndex = pageIndex;
        }

        this.getBilling();
      });
  }

  ngOnInit(): void {
    this.getUserClient()
  }

  ngAfterViewInit(): void {
    this.searchBar.valueChanges.pipe(debounceTime(500), takeUntil(this.onDestroy$), distinctUntilChanged()).subscribe(content => {
      this.getBilling(content!);
    });
  }

  getUserClient() {
    const encryptedData = localStorage.getItem('userInfo');
    if (encryptedData) this.userInfo = this.encryptionService.decryptData(encryptedData);
  }

  getBilling(searchTerm: string = '') {
    const filters = {
      plantName: searchTerm,
      pageSize: this.pageSize,
      page: this.pageIndex,
      ...this.generalFilters
    };

    this.moduleServices.getBilling(filters).subscribe({
      next: (response: entity.DataBillingTableMapper) => {
        this.dataSource.data = response?.data;
        this.totalItems = response?.totalItems;
        this.dataSource.sort = this.sort;
        this.pageIndex = filters.page;
      },
      error: error => {
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert');
        console.log(error);
      }
    });
  }

  generateInvoice() {
    const objData: entity.CreateInvoice | any = {
      clientId: this.userInfo.clientes[0],
      ...this.generalFilters
    }

    this.moduleServices.generateInvoice(objData).subscribe({
      next: (response: any) => {
        this.notificationService.notificacion(`Energy generation has been updated.`, 'save')
        this.getBilling(this.searchBar?.value!);
      },
      error: (error: HttpErrorResponse) => {
        const errorMessages = error?.error?.errors?.errors.map((e: any) => e.descripcion)
        this.modalErrors(errorMessages);
      }
    });
  }

  generateInvoiceAction() {
    this.createNotificationModal(true);
  }

  confirmInvoiceAction(oneInvoice?: entity.DataBillingTable) {
    if (oneInvoice) this.oneConfirmInvoice = oneInvoice;
    this.createNotificationModal(false);
  }

  updateMultipleInvoiceStatuses() {
    const objData: entity.DataBillingTable | any[] = this.selection?.selected.length ? this.selection?.selected : [this.oneConfirmInvoice]
    const filteredInvoices = objData.filter(invoice => invoice.status != 2);

    filteredInvoices.forEach((data: any) => {
      delete data.amountWithIva;
      delete data.formattedGeneratedEnergyKwh;
      delete data.originalGeneratedEnergyKwh;
      delete data.formattedAmount;
      delete data.formattedAmountWithIva;
      delete data.formattedRate;
      delete data.formatterStatus;
    });

    this.moduleServices.updateMultipleInvoiceStatuses(filteredInvoices).subscribe({
      next: (_) => {
        this.notificationService.notificacion(`The changes have been successfully saved, and the presented data has been adjusted.`, 'save')
          .afterClosed()
          .subscribe((_ => {
            this.getBilling(this.searchBar?.value!)
            this.modifiedElements = []
          }));
      },
      error: (error: HttpErrorResponse) => {
        const errorMessages = error?.error?.errors?.errors.map((e: any) => e.descripcion)
        this.modalErrors(errorMessages);
      }
    });
  }

  updateModifiedElements(oneInvoice?: entity.DataBillingTable) {
    let invoices: entity.DataBillingTable | any[] = oneInvoice ? [oneInvoice] : this.modifiedElements

    const filteredInvoices = invoices.map((data) => ({
      generatedEnergyKwh: data.generatedEnergyKwh,
      subtotal: data.subtotal,
      iva: data.iva,
      total: data.total,
      status: data.status,
      invoiceId: data.invoiceId,
    }));

    this.moduleServices.saveBillingTableData(filteredInvoices).subscribe({
      next: () => {
        this.notificationService.notificacion(`The changes have been successfully saved, and the presented data has been adjusted.`, 'save')
          .afterClosed()
          .subscribe((_ => {
            this.getBilling(this.searchBar?.value!)
            this.modifiedElements = []
          }));
      },
      error: (error: HttpErrorResponse) => {
        const errorMessages = error?.error?.errors?.errors.map((e: any) => e.descripcion)
        this.modalErrors(errorMessages);
      }
    });
  }

  createNotificationModal(generate: boolean) {
    let dataNotificationModal: notificationData
    if (generate) dataNotificationModal = this.notificationDataService.invoicesNotificationData(generate, this.generalFilters)!;
    else dataNotificationModal = this.notificationDataService.invoicesNotificationData(generate)!;

    const dialogRef = this.dialog.open(NotificationComponent, {
      width: '540px',
      data: dataNotificationModal
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.confirmed) {
        if (generate) this.generateInvoice()
        else this.updateMultipleInvoiceStatuses()
      }
    });
  }

  handleInput(event: any, element: any, isBlurEvent: boolean = false) {
    const cleanedValue: any = this.cleanFormattedValue(event.target.value);

    element.generatedEnergyKwh = cleanedValue;
    element.formattedGeneratedEnergyKwh = this.getFormattedValue(cleanedValue);

    if (isBlurEvent) event.target.value = element.formattedGeneratedEnergyKwh;
    this.trackChanges(element);
  }

  trackChanges(element: any) {
    const index = this.modifiedElements.findIndex(el => el.invoiceId === element.invoiceId);

    const cleanedOriginalEnergy = this.cleanFormattedValue(element.originalGeneratedEnergyKwh);
    const cleanedCurrentEnergy = this.cleanFormattedValue(element.generatedEnergyKwh);

    const isEnergyChanged = cleanedOriginalEnergy !== cleanedCurrentEnergy;
    const isEnergyCleared = cleanedCurrentEnergy === null;

    if (isEnergyCleared && index !== -1) this.modifiedElements.splice(index, 1);
    else if (isEnergyChanged && index === -1) this.modifiedElements.push({ ...element });
    else if (!isEnergyChanged && index !== -1) this.modifiedElements.splice(index, 1);
    else if (isEnergyChanged && index >= 0) this.modifiedElements[index] = { ...element };
  }

  cleanFormattedValue(value: any): number | null {
    if (!value) return null;
    const cleanedValue = value.toString().replace(/[^\d.-]/g, '');
    const parsedValue = parseFloat(cleanedValue);
    return isNaN(parsedValue) ? null : parsedValue;
  }

  getFormattedValue(value: string): string {
    const numberValue = parseFloat(value);
    return !isNaN(numberValue)
      ? numberValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
      : '';
  }

  navigate(link: string) {
    this.router.navigateByUrl(link);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();

      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  toggleRow(row: any) {
    this.selection.toggle(row);
  }

  checkboxLabel(row?: PeriodicElement): string {
    if (!row) return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  getServerData(event: PageEvent): void {
    if (event.pageSize !== this.pageSize || event.pageIndex !== this.pageIndex - 1) {
      this.store.dispatch(updatePagination({ pageIndex: event.pageIndex, pageSize: event.pageSize }));
    }
  }

  changePageSize(event: any) {
    const newSize = event.value;
    this.pageSize = newSize;

    if (this.paginator) {
      this.paginator.pageSize = newSize;
      this.paginator._changePageSize(newSize);
    }

    this.getBilling();
  }

  exportInformation() {
    this.moduleServices.downloadExcelReport({
      startDate: this.generalFilters.startDate,
      endDate: this.generalFilters.endDate!,
      plantName: this.searchBar?.value!
    }).subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const link = document.createElement('a');
        const url = window.URL.createObjectURL(blob);
        link.href = url;
        link.download = 'ExcelTemplate.xlsx';
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: error => {
        this.notificationService.notificacion('Talk to the administrator.', 'alert');
        console.log(error);
      }
    })
  }

  modalErrors(errors: any) {
    const dataNotificationModal: notificationData = this.notificationDataService.errors(errors)!;
    this.dialog.open(NotificationComponent, {
      width: '540px',
      data: dataNotificationModal
    })
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }
}
