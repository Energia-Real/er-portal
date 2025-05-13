import { Component, OnDestroy, Input, OnInit, ViewChild, SimpleChanges, AfterViewInit } from '@angular/core';
import { combineLatest, distinctUntilChanged, Observable, Subject, takeUntil } from 'rxjs';
import * as entity from '../../../billing-model';
import { Options } from 'tabulator-tables';
import { InvoiceTableService } from '@app/pages/billing-main/billing-table.service';
import { GeneralFilters, UserInfo } from '@app/shared/models/general-models';
import { EncryptionService } from '@app/shared/services/encryption.service';
import { BillingService } from '@app/pages/billing-main/billing.service';
import { Store } from '@ngrx/store';
import { selectPageIndex, selectPageSize } from '@app/core/store/selectors/paginator.selector';
import { TranslationService } from '@app/shared/services/i18n/translation.service';
import { TabulatorTableComponent } from '@app/shared/components/tabulator-table/tabulator-table.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrl: './sites.component.scss',
  standalone: false
})
export class SitesComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();

  generalFilters$!: Observable<GeneralFilters>;

  @ViewChild(TabulatorTableComponent) tabulatorTable!: TabulatorTableComponent;
  @ViewChild('paginator', { static: false }) paginator!: MatPaginator;
  @Input() filterData!: entity.FilterBillingDetails

  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageSize: number = 10;
  pageIndex: number = 1;
  totalItems: number = 0;

  sites: entity.SitesTableRow[] = [];
  tableConfig: Options = {};

  generalFilters!: GeneralFilters

  userInfo!: UserInfo;

  isLoading: boolean = true;

  constructor(
    private store: Store<{ filters: GeneralFilters }>,
    private invoiceTableService: InvoiceTableService,
    private encryptionService: EncryptionService,
    private moduleServices: BillingService,
    private translationService: TranslationService
  ) {
    this.generalFilters$ = this.store.select(state => state.filters);

    combineLatest([
      this.generalFilters$.pipe(distinctUntilChanged()),
      this.store.select(selectPageSize).pipe(distinctUntilChanged()),
      this.store.select(selectPageIndex).pipe(distinctUntilChanged()),
    ])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(([generalFilters, pageSize, pageIndex]) => {
        this.generalFilters = generalFilters;

        if (this.paginator) {
          this.paginator.pageSize = pageSize;
          this.paginator.pageIndex = pageIndex;
        }
        
        this.getFilters();
      });
  }

  ngOnInit(): void {
    this.loadTableColumns();
  }

  loadTableColumns() {
    this.translationService.currentLang$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.loadTableColumns2();
      });
  }

  loadTableColumns2(): void {
    this.invoiceTableService.getTableOptionsSites()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((options) => {
        this.tableConfig = { ...options };

        if (this.tabulatorTable) {
          setTimeout(() => {
            this.tabulatorTable.updateColumns();
          });
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filterData'] && !changes['filterData'].firstChange) {
      const prev = changes['filterData'].previousValue;
      const curr = changes['filterData'].currentValue;
      if (JSON.stringify(prev) !== JSON.stringify(curr)) this.getFilters();
    }
  }


  getFilters() {
    const encryptedData = localStorage.getItem('userInfo');
    if (encryptedData) {
      this.userInfo = this.encryptionService.decryptData(encryptedData);

      const filters = {
        startDate: this.generalFilters.startDate,
        endDate: this.generalFilters.endDate,
        customerName: this.filterData?.customerName ?? '',
        legalName: this.filterData?.legalName ?? '',
        siteName: this.filterData?.siteName ?? '',
        productType: this.filterData?.productType ?? '',
        pageSize: this.pageSize,
        page: this.pageIndex,
        clientId: this.userInfo.clientes[0]
      }

      this.getsites(filters);
    }
  }

  getsites(filters: any) {
    this.moduleServices.getBillingSites(filters).subscribe({
      next: (response: entity.DataBillingSitesTableMapper) => {
        this.sites = response.data
        this.totalItems = response?.totalItems;
        this.pageIndex = filters.page;
        this.isLoading = false;
      },
    });
  }

  getServerData(event: any) {
    console.log(event)
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
