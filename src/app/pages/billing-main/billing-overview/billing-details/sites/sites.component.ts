import { Component, OnDestroy, Input, OnInit, ViewChild, SimpleChanges } from '@angular/core';
import { Subject, switchMap, takeUntil } from 'rxjs';
import * as entity from '../../../billing-model';
import { Options } from 'tabulator-tables';
import { InvoiceTableService } from '@app/pages/billing-main/billing-table.service';
import { GeneralPaginatedResponse, UserInfo } from '@app/shared/models/general-models';
import { BillingService } from '@app/pages/billing-main/billing.service';
import { TranslationService } from '@app/shared/services/i18n/translation.service';
import { TabulatorTableComponent } from '@app/shared/components/tabulator-table/tabulator-table.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { HttpErrorResponse } from '@angular/common/module.d-CnjH8Dlt';

@Component({
  selector: 'app-sites',
  templateUrl: './sites.component.html',
  styleUrl: './sites.component.scss',
  standalone: false
})
export class SitesComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();

  @ViewChild(TabulatorTableComponent) tabulatorTable!: TabulatorTableComponent;
  @ViewChild('paginator', { static: false }) paginator!: MatPaginator;
  @Input() filterData!: entity.BillingOverviewFilterData

  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageSize: number = 10;
  pageIndex: number = 0;
  totalItems: number = 0;

  sites: entity.SitesTableRow[] = [];
  tableConfig: Options = {};

  userInfo!: UserInfo;

  isLoading: boolean = true;

  constructor(
    private invoiceTableService: InvoiceTableService,
    private moduleServices: BillingService,
    private translationService: TranslationService
  ) { }

  ngOnInit(): void {
    this.loadTableColumns();
    this.getFilters();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['filterData'] && !changes['filterData'].firstChange) {
      const prev = changes['filterData'].previousValue;
      const curr = changes['filterData'].currentValue;
      if (JSON.stringify(prev) !== JSON.stringify(curr)) this.getFilters();
    }
  }

  loadTableColumns() {
    this.translationService.currentLang$
      .pipe(
        takeUntil(this.onDestroy$),
        switchMap(() => this.invoiceTableService.getTableOptionsSites())
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

  getFilters() {
    const filters: entity.BillingOverviewFilterData = {
      customerNames: this.filterData?.customerNames ?? [],
      legalName: this.filterData?.legalName ?? [],
      productType: this.filterData?.productType ?? [],
      startDate: this.filterData?.startDate ?? '',
      endDate: this.filterData?.endDate ?? '',
      pageSize: this.pageSize,
      page: this.pageIndex + 1
    };

    this.getBillingSites(filters);
  }

  getBillingSites(filters: entity.BillingOverviewFilterData) {
    this.moduleServices.getBillingSites(filters).subscribe({
      next: (response: GeneralPaginatedResponse<entity.SitesTableRow>) => {
        this.sites = response.data;
        this.totalItems = response.totalItems;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
      }
    });
  }

  getServerData(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getFilters();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
