import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DrawerGeneral, GeneralFilters, GeneralResponse } from '@app/shared/models/general-models';
import { Store } from '@ngrx/store';
import { combineLatest, distinctUntilChanged, Observable, Subject, Subscription, takeUntil } from 'rxjs';
import { ColumnDefinition, CellComponent, Options } from 'tabulator-tables';
import { BillingService } from '../../billing.service';
import { Bill, CurrentBillResponse } from '../../billing-model';
import { MonthAbbreviationPipe } from '@app/shared/pipes/month-abbreviation.pipe';
import { TabulatorTableComponent } from '@app/shared/components/tabulator-table/tabulator-table.component';
import { TranslationService } from '@app/shared/services/i18n/translation.service';
import { selectDrawer } from '@app/core/store/selectors/drawer.selector';
import { updateDrawer } from '@app/core/store/actions/drawer.actions';

@Component({
  selector: 'app-current-billing',
  templateUrl: './current-billing.component.html',
  styleUrl: './current-billing.component.scss',
  standalone: false
})
export class CurrentBillingComponent implements OnInit, OnDestroy, AfterViewInit {
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
    private moduleServices: BillingService,
    private translationService: TranslationService
  ) {
    this.initColumns();
    this.tableConfig = {
      maxHeight: 280,
      layout: "fitColumns",
      columns: this.columns,
      movableColumns: true,
    };
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
    // Subscribe to language changes to update column titles
    this.translationService.currentLang$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        this.initColumns();
        // Update the table configuration with new columns
        this.tableConfig = {
          ...this.tableConfig,
          columns: this.columns
        };
        
        // If the table component is available, update the columns
        if (this.tabulatorTable) {
          // Use the new updateColumns method
          setTimeout(() => {
            this.tabulatorTable.updateColumns();
          });
        }
      });
  }

  ngAfterViewInit(): void {
    // After the view is initialized, we need to make sure the table is updated when the language changes
    // This is needed because the ViewChild might not be available in ngOnInit
    this.translationService.currentLang$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        // Only update if the table is initialized
        if (this.tabulatorTable) {
          // Set a timeout to ensure this runs after Angular's change detection
          setTimeout(() => {
            // Update the columns
            this.initColumns();
            this.tableConfig = {
              ...this.tableConfig,
              columns: this.columns
            };
            
            // Use the new updateColumns method
            this.tabulatorTable.updateColumns();
          });
        }
      });
  }

  initColumns() {
    this.columns = [
      {
        title: this.translationService.instant('FACTURACION.NOMBRE_LEGAL'),
        field: "legalName",
        headerSort: false,
        vertAlign: "middle",
        minWidth: 150,
      },
      {
        title: this.translationService.instant('FACTURACION.AÑO'),
        field: "year",
        headerSort: false,
        vertAlign: "middle",
        minWidth: 80,
      },
      {
        title: this.translationService.instant('FACTURACION.MES'),
        field: "month",
        formatter: (cell: CellComponent) => {
          const value = cell.getValue();
          return this.monthAbbrPipe.transform(value);
        },
        headerSort: false,
        vertAlign: "middle",
        minWidth: 80,
      },
      {
        title: this.translationService.instant('FACTURACION.ESTADO'),
        field: "status",
        minWidth: 105,
        formatter: (cell: CellComponent) => {
          const value = cell.getValue();
          // Define colors for different status IDs
          const statusColors: {[key: string]: {bg: string, text: string}} = {
            "Payed": { bg: "#33A02C", text: "white" },      // Green - Paid in full
            "Overdue": { bg: "#E31A1C", text: "white" },    // Orange - Pendiente/Partially paid
            "Pending": { bg: "#E5B83E", text: "white" }     // Red - Open
          };

          // Get colors for this status ID (or use defaults)
          const colors = (value && statusColors[value])
            ? statusColors[value]
            : { bg: "#E0E0E0", text: "black" };

          // Translate status value
          let translatedValue = value;
          if (value === "Payed") {
            translatedValue = this.translationService.instant('FACTURACION.PAGADO');
          } else if (value === "Overdue") {
            translatedValue = this.translationService.instant('FACTURACION.VENCIDO');
          } else if (value === "Pending") {
            translatedValue = this.translationService.instant('FACTURACION.PENDIENTE');
          }

          // Create a span with the specified styling
          return `<span style="
            color: ${colors.text};
            background-color: ${colors.bg};
            border-radius: 16px;
            padding: 4px 12px;
            font-weight: 500;
            display: flex;
            align-items:center;
            justify-content:center;
            width: 95px;
            height: 35px
          ">${translatedValue}</span>`;
        },
        hozAlign: "left",
        headerSort: false,
        vertAlign: "middle"
      },
      {
        title: this.translationService.instant('FACTURACION.PRODUCTO'),
        field: "product",
        minWidth: 120,
        formatter: (cell: CellComponent) => {
          const value = cell.getValue();
          // Default styling (for current string-based product)
          let icon = '';
          let bgColor = '#E0E0E0';
          let textColor = 'black';
          let translatedValue = value;

          // Prepare for future structure with IDs
          if (value) {
            // Future structure: validate by ID
            switch (value) {
              case 'SOLAR': // Solar
                icon = '<img src="assets/svg/sun.svg" style=" margin-right:18px; " title="Solar">';
                bgColor = '#EE5427';
                textColor = 'white';
                translatedValue = this.translationService.instant('FACTURACION.SOLAR');
                break;
              case 'BESS': // BESS
                icon = '<img src="assets/svg/battery.svg" style=" margin-right:18px; " title="BESS">';
                bgColor = '#57B1B1';
                textColor = 'white';
                translatedValue = this.translationService.instant('FACTURACION.BESS');
                break;
              case 'MEM': // MEM
                icon = '<img src="assets/svg/mem.svg" style=" margin-right:18px; " title="MEM">';
                bgColor = '#792430';
                textColor = 'white';
                translatedValue = this.translationService.instant('FACTURACION.MEM');
                break;
            }
          }

          // Create a span with the specified styling
          return `<span style="
            color: ${textColor};
            background-color: ${bgColor};
            border-radius: 16px;
            padding: 4px 18px;
            font-weight: 500;
            display: flex;
            align-items:center;
            justify-content:center;
            width: 133px;
            height: 35px        ">${icon}${translatedValue}</span>`;
        },
        hozAlign: "left",
        headerSort: false,
        vertAlign: "middle"
      },
      {
        title: this.translationService.instant('FACTURACION.MONTO'),
        field: "amount",
        minWidth: 120,
        formatter: (cell: CellComponent) => {
          const value = cell.getValue();
          // Format as currency
          const formattedValue = new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 2
          }).format(value || 0);

          // Add MXN after the amount
          return `${formattedValue} MXN`;
        },
        hozAlign: "left",
        headerSort: false,
        vertAlign: "middle"
      },
      {
        title: this.translationService.instant('FACTURACION.ACCION'),
        field: 'actions',
        minWidth: 180,
        formatter: (cell: CellComponent) => {
          const downloadPdfTitle = this.translationService.instant('FACTURACION.DESCARGAR_PDF');
          const downloadXmlTitle = this.translationService.instant('FACTURACION.DESCARGAR_XML');
          const viewDetailsTitle = this.translationService.instant('FACTURACION.VER_DETALLES');
          
          // Generate HTML with the requested icons in a horizontal layout
          return `
            <div style="display: flex; justify-content: space-around; align-items: center;">
              <img src="assets/svg/pdf-download.svg" class="action-icon" data-action="downloadPdf" style="cursor:pointer; margin:0 18px; " title="${downloadPdfTitle}">
              <img src="assets/svg/xml-download.svg" class="action-icon" data-action="downloadXml" style="cursor:pointer; margin:0 18px;" title="${downloadXmlTitle}">
              <img src="assets/img/eye-open-orange.png" class="action-icon" data-action="viewDetails" style="cursor:pointer; margin:0 18px; " title="${viewDetailsTitle}">
            </div>
          `;
        },
        cellClick: (e: any, cell: CellComponent) => {
          // Get the clicked element
          const element = e.target as HTMLElement;

          // Check if it's one of our action icons
          if (element.classList.contains('action-icon')) {
            const action = element.getAttribute('data-action');
            const row = cell.getRow().getData();

            // Call the appropriate function based on the action
            switch (action) {
              case 'downloadPdf':
                this.downloadPdf(row);
                break;
              case 'downloadXml':
                this.downloadXml(row);
                break;
              case 'viewDetails':
                this.viewDetails(row);
                break;
            }
          }
        },
        headerSort: false,
        vertAlign: "middle"
      }
    ];
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
