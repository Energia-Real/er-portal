import { Component, OnDestroy, OnInit } from '@angular/core';
import { GeneralFilters, GeneralResponse } from '@app/shared/models/general-models';
import { Store } from '@ngrx/store';
import { combineLatest, distinctUntilChanged, Observable, Subject, takeUntil } from 'rxjs';
import { ColumnDefinition, CellComponent } from 'tabulator-tables';
import { BillingService } from '../../billing.service';
import { Bill, CurrentBillResponse } from '../../billing-model';
import { MonthAbbreviationPipe } from '@app/shared/pipes/month-abbreviation.pipe';

@Component({
  selector: 'app-current-billing',
  templateUrl: './current-billing.component.html',
  styleUrl: './current-billing.component.scss'
})
export class CurrentBillingComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();
  generalFilters!: GeneralFilters
  generalFilters$!: Observable<GeneralFilters>;


  bills!: Bill[] ;
  private monthAbbrPipe = new MonthAbbreviationPipe();
  
  columns: ColumnDefinition[] = [
    { 
      title: "Legal Name", 
      field: "legalName",
      headerSort: false,
      vertAlign: "middle"
    },
    { 
      title: "Year", 
      field: "year",
      headerSort: false,
      vertAlign: "middle"
    },
    { 
      title: "Month", 
      field: "month", 
      formatter: (cell: CellComponent) => {
        const value = cell.getValue();
        return this.monthAbbrPipe.transform(value);
      },
      headerSort: false,
      vertAlign: "middle"
    },
    { 
      title: "Status", 
      field: "status.description", 
      formatter: (cell: CellComponent) => {
        const row = cell.getRow().getData();
        const statusId = row['status']?.id;
        const statusDescription = row['status']?.description || 'Unknown';
        
        // Define colors for different status IDs
        const statusColors: {[key: string]: {bg: string, text: string}} = {
          "PYD": { bg: "#33A02C", text: "white" },      // Green - Paid in full
          //"UKWN": { bg: "#2196F3", text: "white" },     // Blue - Pagado/Abierta
          "OVD": { bg: "#E31A1C", text: "white" },      // Orange - Pendiente/Partially paid
          "PDG": { bg: "#E5B83E", text: "white" }       // Red - Open
        };
        
        // Get colors for this status ID (or use defaults)    
        const colors = (statusId && statusColors[statusId]) 
          ? statusColors[statusId] 
          : { bg: "#E0E0E0", text: "black" };
        
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
        ">${statusDescription}</span>`;
      },
      hozAlign: "center",
      headerSort: false,
      vertAlign: "middle"
    },
    { 
      title: "Product", 
      field: "product", 
      formatter: (cell: CellComponent) => {
        const row = cell.getRow().getData();
        // Currently product is a string, but prepare for future structure
        let productId = '';
        let productDescription = '';
        
        // Check if product is already an object with id and description
        if (row['product'] && typeof row['product'] === 'object' && row['product'].id) {
          productId = row['product'].id;
          productDescription = row['product'].description || '';
        } else {
          // Current structure: product is just a string
          productDescription = cell.getValue() || '';
        }
        
        // Default styling (for current string-based product)
        let icon = '';
        let bgColor = '#E0E0E0';
        let textColor = 'black';
        
        // Prepare for future structure with IDs
        if (productId) {
          // Future structure: validate by ID
          switch (productId) {
            case 'P1': // Solar
              icon = '<i class="fas fa-sun" style="margin-right: 5px;"></i>';
              bgColor = '#EE5427';
              textColor = 'white';
              break;
            case 'P2': // BESS
              icon = '<i class="fas fa-battery-full" style="margin-right: 5px;"></i>';
              bgColor = '#57B1B1';
              textColor = 'white';
              break;
            case 'P3': // MEM
              icon = '<i class="fas fa-calendar-alt" style="margin-right: 5px;"></i>';
              bgColor = '#792430';
              textColor = 'white';
              break;
          }
        }
        
        // Create a span with the specified styling
        return `<span style="
          color: ${textColor}; 
          background-color: ${bgColor}; 
          border-radius: 16px; 
          padding: 4px 12px; 
          font-weight: 500;
          display: flex;
          align-items:center;
          justify-content:center;
          width: 133px;
          height: 35px        ">${icon}${productDescription}</span>`;
      },
      hozAlign: "center",
      headerSort: false,
      vertAlign: "middle"
    },
   
    { 
      title: "Amount", 
      field: "amount", 
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
      title: 'Action', 
      field: 'actions', 
      formatter: (cell: CellComponent) => {
        // Generate HTML with the requested icons in a horizontal layout
        return `
          <div style="display: flex; justify-content: space-around; align-items: center;">
            <img src="assets/svg/pdf-download.svg" class="action-icon" data-action="downloadPdf" style="cursor:pointer; margin:0 18px; " title="Download PDF">
            <img src="assets/svg/xml-download.svg" class="action-icon" data-action="downloadXml" style="cursor:pointer; margin:0 18px;" title="Download XML">
            <img src="assets/img/eye-open-orange.png" class="action-icon" data-action="viewDetails" style="cursor:pointer; margin:0 18px; " title="View Details">
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

  constructor(
    private store: Store<{ filters: GeneralFilters }>,
    private moduleServices: BillingService,
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
  }

  getBilling() {
    const filters = {
      ...this.generalFilters
    };

    this.moduleServices.getCurrentInvoices(filters).subscribe({
      next: (response: GeneralResponse<CurrentBillResponse>) => {
        this.bills = response.response.currentBillResponse
        console.log(response.response)
      },
      error: error => {
        console.log(error);
      }
    });
  }

  ngOnInit(): void {
    // No initialization needed as the table component handles everything internally
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  // Action methods for the icons
  downloadPdf(row: any): void {
    console.log('Download PDF clicked for:', row);
  }

  downloadXml(row: any): void {
    console.log('Download XML clicked for:', row);
  }

  viewDetails(row: any): void {
    console.log('View Details clicked for:', row);
  }
}
