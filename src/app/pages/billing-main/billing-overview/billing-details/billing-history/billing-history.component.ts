import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import * as entity from '../../../billing-model';
import { BillingService } from '@app/pages/billing-main/billing.service';
import { GeneralPaginatedResponse } from '@app/shared/models/general-models';
import { CellComponent, ColumnDefinition } from 'tabulator-tables';
import { MonthAbbreviationPipe } from '@app/shared/pipes/month-abbreviation.pipe';

@Component({
  selector: 'app-billing-history',
  templateUrl: './billing-history.component.html',
  styleUrl: './billing-history.component.scss',
  standalone: false
})
export class BillingHistoryComponent implements OnInit, OnDestroy, OnChanges {
  private onDestroy$ = new Subject<void>();

  @Input() filterData!: entity.FilterBillingDetails

  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageSize: number = 10;
  pageIndex: number = 1;
  totalItems: number = 0;

  bills!: entity.Bill[];
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
      field: "status",
      formatter: (cell: CellComponent) => {
        const value = cell.getValue();
        // Define colors for different status IDs
        const statusColors: { [key: string]: { bg: string, text: string } } = {
          "Payed": { bg: "#33A02C", text: "white" },      // Green - Paid in full
          "Overdue": { bg: "#E31A1C", text: "white" },      // Orange - Pendiente/Partially paid
          "Pending": { bg: "#E5B83E", text: "white" }       // Red - Open
        };

        // Get colors for this status ID (or use defaults)    
        const colors = (value && statusColors[value])
          ? statusColors[value]
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
        ">${value}</span>`;
      },
      hozAlign: "left",
      headerSort: false,
      vertAlign: "middle"
    },
    {
      title: "Product",
      field: "product",
      formatter: (cell: CellComponent) => {
        const value = cell.getValue();
        // Default styling (for current string-based product)
        let icon = '';
        let bgColor = '#E0E0E0';
        let textColor = 'black';

        // Prepare for future structure with IDs
        if (value) {
          // Future structure: validate by ID
          switch (value) {
            case 'SOLAR': // Solar
              icon = '<img src="assets/svg/sun.svg" style=" margin-right:18px; " title="Solar">';
              bgColor = '#EE5427';
              textColor = 'white';
              break;
            case 'BESS': // BESS
              icon = '<img src="assets/svg/battery.svg" style=" margin-right:18px; " title="BESS">';
              bgColor = '#57B1B1';
              textColor = 'white';
              break;
            case 'MEM': // MEM
              icon = '<img src="assets/svg/mem.svg" style=" margin-right:18px; " title="MEM">';
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
          padding: 4px 18px; 
          font-weight: 500;
          display: flex;
          align-items:center;
          justify-content:center;
          width: 133px;
          height: 35px        ">${icon}${value}</span>`;
      },
      hozAlign: "left",
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
    private moduleService: BillingService
  ) { }

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
    this.getBillingHistory();
  }

  getBillingHistory() {
    this.moduleService.getBillingHistory(this.filterData).subscribe({
      next: (response: GeneralPaginatedResponse<entity.HistoryBillResponse>) => {
        this.totalItems = response?.totalItems;
        console.log(response)
        if (response.data[0] != null) {
          this.bills = response.data[0].historyBillResponse
        } else {
          this.bills = []
          this.pageIndex = 0;
        }
        console.log(this.bills)
      },
      error: error => {
        this.bills = []
        this.pageIndex = 0;
        console.log(error);
      }
    })
  }

  getServerData(event: any) {
    console.log(event)
  }

  // Action methods for the icons
  downloadPdf(row: any): void {
    console.log('Download PDF clicked for:', row);
    this.moduleService.downloadBilling(["pdf"], [row.billingId.toString()]).subscribe({
      next: (doc: Blob) => {
        console.log(doc)
        const url = window.URL.createObjectURL(doc);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'billing.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      },
      error: (err) => {
        console.log(err)
      }
    })
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
      }
    })
  }

  viewDetails(row: any): void {
    console.log('View Details clicked for:', row);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
