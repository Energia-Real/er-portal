import { Subject, switchMap, takeUntil } from 'rxjs';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Options } from 'tabulator-tables';
import { InvoiceTableService } from '@app/pages/billing-main/billing-table.service';
import * as entity from '../../../billing-model';
import { BillingService } from '@app/pages/billing-main/billing.service';
import { UserInfo } from '@app/shared/models/general-models';
import { EncryptionService } from '@app/shared/services/encryption.service';
import { updateDrawer } from '@app/core/store/actions/drawer.actions';
import { Store } from '@ngrx/store';
import { NOTIFICATION_CONSTANTS } from '@app/core/constants/notification-constants';
import { TranslationService } from '@app/shared/services/i18n/translation.service';
import { TabulatorTableComponent } from '@app/shared/components/tabulator-table/tabulator-table.component';
import { HttpErrorResponse } from '@angular/common/module.d-CnjH8Dlt';

@Component({
  selector: 'app-modal-invoice-details',
  standalone: false,
  templateUrl: './modal-invoice-details.component.html',
  styleUrl: './modal-invoice-details.component.scss'
})
export class ModalInvoiceDetailsComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();
  CANCEL = NOTIFICATION_CONSTANTS.CANCEL_TYPE;

  @ViewChild(TabulatorTableComponent) tabulatorTable!: TabulatorTableComponent;

  @Input() isOpen = false;
  @Input() modeDrawer: "Edit" | "Create" | "View" = "Create";
  @Input() set invoice(invoiceData: entity.Bill | null | undefined) {
    if (!invoiceData) return;
    console.log(invoiceData);
    this.getUserClient(invoiceData);
  }

  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageSize: number = 10;
  pageIndex: number = 1;
  totalItems: number = 0;

  invoicesDetailsHeader!: entity.InvoiceDetailsCurrency
  invoicesDetails: entity.InvoiceDetailsTableRow[] = [];
  tableConfig: Options = {};
  isLoading: boolean = true;
  userInfo!: UserInfo;

  constructor(
    private invoiceTableService: InvoiceTableService,
    private moduleServices: BillingService,
    private encryptionService: EncryptionService,
    private store: Store,
    private translationService: TranslationService
  ) { }

  ngOnInit(): void {
    this.loadTableColumns();
  }

  loadTableColumns() {
    this.translationService.currentLang$
      .pipe(
        takeUntil(this.onDestroy$),
        switchMap(() => this.invoiceTableService.getTableOptionsInvoiceDetails())
      )
      .subscribe({
        next: (options) => {
          this.tableConfig = { ...options };

          if (this.tabulatorTable) this.tabulatorTable.updateColumns();
        },
        error: (err) => {
          console.error('Error al cargar la configuración de la tabla:', err);
        }
      });
  }

  getInvoiceDetailsHeader(idClient: number) {
    this.moduleServices.getInvoiceDetailsHeader(idClient).subscribe({
      next: (response: entity.InvoiceDetailsCurrencyHeader) => {
        console.log(response.response);
        this.invoicesDetailsHeader = response.response
      },
    });
  }

  getInvoiceDetails(filters: any) {
    this.moduleServices.getInvoiceDetails(filters).subscribe({
      next: (response: entity.DataInvoiceDetailsTableMapper) => {
        this.invoicesDetails = response.data
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
      }
    })
  }

  getUserClient(data: entity.Bill) {
    console.log(data);

    const filters = {
      pageSize: this.pageSize,
      page: this.pageIndex,
      clientId: data.billingId
    }

    this.getInvoiceDetailsHeader(data.billingId);
    this.getInvoiceDetails(filters);
  }

  downloadPdf(row: entity.InvoiceDetailsTableRow) {
    console.log(row);
    console.log('downloadPdf');
  }

  downloadXml(row: entity.InvoiceDetailsTableRow) {
    console.log(row);
    console.log('downloadXml');
  }

  viewDetails(row: entity.InvoiceDetailsTableRow) {
    console.log(row);
    console.log('viewDetails');
  }

  getServerData(event: any) {
    console.log(event)
  }

  closeModal(notificationType: string) {
    this.invoicesDetails = [];
    this.isOpen = false;
    this.isLoading = true;
    this.store.dispatch(updateDrawer({ drawerOpen: false, drawerAction: "Create", drawerInfo: null, needReload: false }));
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
