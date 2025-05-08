import { Subject } from 'rxjs';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ColumnDefinition, CellComponent, Options } from 'tabulator-tables';

@Component({
  selector: 'app-modal-invoice-details',
  standalone: false,
  templateUrl: './modal-invoice-details.component.html',
  styleUrl: './modal-invoice-details.component.scss'
})
export class ModalInvoiceDetailsComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();

  @Input() isOpen = false;
  @Input() modeDrawer: "Edit" | "Create" | "View" = "Create";
  @Input() set invoice(invoiceData: any | null | undefined) {
    console.log(invoiceData);
  }

  invoicesDetails!: any[];
  tableConfig!: Options;
  columns: ColumnDefinition[] = [
    {
      title: "Production",
      field: "production",
      headerSort: false,
      vertAlign: "middle",
      minWidth: 120,
      hozAlign: "right",
      formatter: (cell: CellComponent) => {
        const value = cell.getValue();
        return value.toLocaleString('es-MX', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
      }
    },
    {
      title: "Concept",
      field: "concept",
      headerSort: false,
      vertAlign: "middle",
      minWidth: 50,
      maxWidth: 80,
    },
    {
      title: "Description",
      field: "description",
      headerSort: false,
      vertAlign: "middle",
      width: 200,
      cssClass: "wrap-text-cell"
    },
    {
      title: "Unit value",
      field: "unitValue",
      minWidth: 150,
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
      title: "Taxes",
      field: "taxes",
      minWidth: 150,
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
      title: "Total Amount",
      field: "amount",
      minWidth: 150,
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
  ];

  constructor(
  ) {
    this.tableConfig = {
      maxHeight: 280,
      layout: "fitColumns",
      columns: this.columns,
      movableColumns: true,
    }
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.invoicesDetails = [
        {
          production: 1000000,
          concept: "kWh",
          description: "81112001 ‐ Servicio de procesamiento de datos en línea Servicio de Monitoreo The Landmark Baja Tension febrero 25",
          unitValue: 1000000,
          taxes: 1000000,
          amount: 1000000
        },
        {
          production: 2000000,
          concept: "kWh",
          description: "81112001 ‐ Servicio de procesamiento de datos en línea Servicio de Monitoreo The Landmark Baja Tension febrero 25",
          unitValue: 2000000,
          taxes: 2000000,
          amount: 2000000
        },
        {
          production: 3000000,
          concept: "kWh",
          description: "81112001 ‐ Servicio de procesamiento de datos en línea Servicio de Monitoreo The Landmark Baja Tension febrero 25",
          unitValue: 3000000,
          taxes: 3000000,
          amount: 3000000
        },
        {
          production: 1000000,
          concept: "kWh",
          description: "81112001 ‐ Servicio de procesamiento de datos en línea Servicio de Monitoreo The Landmark Baja Tension febrero 25",
          unitValue: 1000000,
          taxes: 1000000,
          amount: 1000000
        },
        {
          production: 2000000,
          concept: "kWh",
          description: "81112001 ‐ Servicio de procesamiento de datos en línea Servicio de Monitoreo The Landmark Baja Tension febrero 25",
          unitValue: 2000000,
          taxes: 2000000,
          amount: 2000000
        },
        {
          production: 3000000,
          concept: "kWh",
          description: "81112001 ‐ Servicio de procesamiento de datos en línea Servicio de Monitoreo The Landmark Baja Tension febrero 25",
          unitValue: 3000000,
          taxes: 3000000,
          amount: 3000000
        },
      ]
      console.log(this.invoicesDetails);
    }, 500);
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
