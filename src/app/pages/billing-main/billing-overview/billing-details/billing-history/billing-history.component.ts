import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { combineLatest, distinctUntilChanged, Observable, Subject, Subscription, switchMap, takeUntil } from 'rxjs';
import * as entity from '../../../billing-model';
import { BillingService } from '@app/pages/billing-main/billing.service';
import { DrawerGeneral, GeneralFilters, GeneralPaginatedResponse } from '@app/shared/models/general-models';
import { ColumnDefinition, Options } from 'tabulator-tables';
import { MonthAbbreviationPipe } from '@app/shared/pipes/month-abbreviation.pipe';
import { TranslationService } from '@app/shared/services/i18n/translation.service';
import { TabulatorTableComponent } from '@app/shared/components/tabulator-table/tabulator-table.component';
import { InvoiceTableService } from '@app/pages/billing-main/billing-table.service';
import { Store } from '@ngrx/store';
import { selectDrawer } from '@app/core/store/selectors/drawer.selector';
import { updateDrawer } from '@app/core/store/actions/drawer.actions';
import { start } from '@popperjs/core';

@Component({
  selector: 'app-billing-history',
  templateUrl: './billing-history.component.html',
  styleUrl: './billing-history.component.scss',
  standalone: false
})
export class BillingHistoryComponent implements OnInit, OnDestroy, OnChanges {

  
  private onDestroy$ = new Subject<void>();

  generalFilters$!: Observable<GeneralFilters>;


  @Input() filterData!: entity.FilterBillingDetails;

  pageSizeOptions: number[] = [1, 2, 3, 5];
  pageSize: number = 10;
  pageIndex: number = 1;
  totalItems: number = 0;

  bills!: entity.Bill[];
  private monthAbbrPipe = new MonthAbbreviationPipe();

  tableConfig!: Options;
  columns: ColumnDefinition[] = [];
  isLoading: Boolean = true;

  drawerOpenSub: Subscription;
  drawerOpenID: boolean = false;
  drawerAction: "Create" | "Edit" | "View" = "Create";
  drawerInfo: any | null | undefined = null;

  generalFilters!: GeneralFilters

  constructor(
    private store: Store<{ filters: GeneralFilters }>,
    private moduleService: BillingService,
    private translationService: TranslationService,
    private invoiceTableService: InvoiceTableService,
  ) {
    this.generalFilters$ = this.store.select(state => state.filters);

    combineLatest([
      this.generalFilters$.pipe(distinctUntilChanged()),
    ])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(([generalFilters]) => {
        this.generalFilters = generalFilters;
        this.getBillingHistory();
      });

    this.drawerOpenSub = this.store.select(selectDrawer).pipe(takeUntil(this.onDestroy$)).subscribe((resp: DrawerGeneral) => {
      this.drawerOpenID = resp.drawerOpen;
      this.drawerAction = resp.drawerAction;
      this.drawerInfo = resp.drawerInfo;
    });
  }


  @ViewChild(TabulatorTableComponent) tabulatorTable!: TabulatorTableComponent;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filterData'] && !changes['filterData'].firstChange) {
      const prev = changes['filterData'].previousValue;
      const curr = changes['filterData'].currentValue;
      // Compara solo los campos relevantes
      if (JSON.stringify(prev) !== JSON.stringify(curr)) {
        this.getBillingHistory();
      }
    }
  }

  ngOnInit(): void {
    this.loadTableColumns();
  }

  loadTableColumns() {
    this.translationService.currentLang$
      .pipe(
        takeUntil(this.onDestroy$),
        switchMap(() => {
          // Create callbacks object using component methods
          const callbacks = {
            downloadPdf: (row: any) => this.downloadPdf(row),
            downloadXml: (row: any) => this.downloadXml(row),
            viewDetails: (row: any) => this.viewDetails(row)
          };
          return this.invoiceTableService.getTableOptionsHistoryBillings(callbacks);
        })
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

  getBillingHistory() {
    const filters = { ...this.filterData, pageSize: this.pageSize, page: this.pageIndex, startDate: this.generalFilters.startDate, endDate: this.generalFilters.endDate };
    this.moduleService.getBillingHistory(filters).subscribe({
      next: (response: GeneralPaginatedResponse<entity.HistoryBillResponse>) => {
        this.totalItems = response?.totalItems;
        if (response.data[0] != null) {
          this.bills = response.data[0].historyBillResponse;
        } else {
          this.bills = [];
          this.pageIndex = 0;
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.bills = [];
        this.pageIndex = 0;
        console.log(error);
      }
    });
  }

  getServerData(event: any) {
    console.log(event);
    this.pageIndex = event.pageIndex + 1;
    this.getBillingHistory()
  }

  // Action methods for the icons
  downloadPdf(row: any): void {
    console.log('Download PDF clicked for:', row);
    this.moduleService.downloadBilling(["pdf"], [row.billingId.toString()]).subscribe({
      next: (doc: Blob) => {
        console.log(doc);
        const url = window.URL.createObjectURL(doc);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'billing.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  downloadXml(row: any): void {
    console.log('Download XML clicked for:', row);
    this.moduleService.downloadBilling(["xml"], [row.billingId.toString()]).subscribe({
      next: (doc: Blob) => {
        const url = window.URL.createObjectURL(doc);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'billing.xml';
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  descargarTabla(tipo: string) {
    this.tabulatorTable.download(tipo);
  }

  viewDetails(row: any): void {
    this.drawerInfo = row;
    this.updDraweStateView(true);
  }

  updDraweStateView(estado: boolean): void {
    this.store.dispatch(updateDrawer({ drawerOpen: estado, drawerAction: "View", drawerInfo: this.drawerInfo, needReload: false }));
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
