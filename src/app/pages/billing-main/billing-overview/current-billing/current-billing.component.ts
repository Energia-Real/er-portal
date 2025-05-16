import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DrawerGeneral, GeneralFilters, GeneralResponse } from '@app/shared/models/general-models';
import { Store } from '@ngrx/store';
import { combineLatest, distinctUntilChanged, Observable, Subject, Subscription, switchMap, takeUntil } from 'rxjs';
import { ColumnDefinition, CellComponent, Options } from 'tabulator-tables';
import { BillingService } from '../../billing.service';
import { Bill, CurrentBillResponse } from '../../billing-model';
import { MonthAbbreviationPipe } from '@app/shared/pipes/month-abbreviation.pipe';
import { TabulatorTableComponent } from '@app/shared/components/tabulator-table/tabulator-table.component';
import { TranslationService } from '@app/shared/services/i18n/translation.service';
import { selectDrawer } from '@app/core/store/selectors/drawer.selector';
import { updateDrawer } from '@app/core/store/actions/drawer.actions';
import { InvoiceTableService } from '../../billing-table.service';

@Component({
  selector: 'app-current-billing',
  templateUrl: './current-billing.component.html',
  styleUrl: './current-billing.component.scss',
  standalone: false
})
export class CurrentBillingComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();
  generalFilters!: GeneralFilters;
  generalFilters$!: Observable<GeneralFilters>;

  @ViewChild(TabulatorTableComponent) tabulatorTable!: TabulatorTableComponent;

  bills!: Bill[];
  private monthAbbrPipe = new MonthAbbreviationPipe();

  tableConfig!: Options;
  columns: ColumnDefinition[] = [];

  drawerOpenSub: Subscription;
  drawerOpenID: boolean = false;
  drawerAction: "Create" | "Edit" | "View" = "Create";
  drawerInfo: any | null | undefined = null;

  isLoading: boolean = true;

  constructor(
    private store: Store<{ filters: GeneralFilters }>,
    private invoiceTableService: InvoiceTableService,
    private moduleServices: BillingService,
    private translationService: TranslationService
  ) {
    
    this.generalFilters$ = this.store.select(state => state.filters);
    combineLatest([
      this.generalFilters$.pipe(distinctUntilChanged()),
    ])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(([generalFilters]) => {
        this.generalFilters = generalFilters;
        this.getBilling();
      });

    this.drawerOpenSub = this.store.select(selectDrawer).pipe(takeUntil(this.onDestroy$)).subscribe((resp: DrawerGeneral) => {
      this.drawerOpenID = resp.drawerOpen;
      this.drawerAction = resp.drawerAction;
      this.drawerInfo = resp.drawerInfo;
    });
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
          return this.invoiceTableService.getTableOptionsCurrentBillings(callbacks);
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

  getBilling() {
    const filters = {
      ...this.generalFilters
    };

    this.moduleServices.getCurrentInvoices(filters).subscribe({
      next: (response: GeneralResponse<CurrentBillResponse>) => {
        this.bills = response.response.currentBillResponse;
        this.isLoading = false;
      },
      error: (error) => {
        console.log(error);
        this.isLoading = false;
      }
    });
  }

  // Action methods for the icons
  downloadPdf(row: any): void {
    console.log('Download PDF clicked for:', row);
    this.moduleServices.downloadBilling(["pdf"], [row.billingId.toString()]).subscribe({
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
    this.moduleServices.downloadBilling(["xml"], [row.billingId.toString()]).subscribe({
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

  viewDetails(row: any): void {
    let objData: any = {
      id: ''
    }

    this.drawerInfo = row
    this.updDraweStateView(true);
  }

  updDraweStateView(estado: boolean): void {
    this.store.dispatch(updateDrawer({ drawerOpen: estado, drawerAction: "View", drawerInfo: this.drawerInfo, needReload: false }));
  }

  descargarTabla(tipo: string) {
    this.tabulatorTable.download(tipo);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
