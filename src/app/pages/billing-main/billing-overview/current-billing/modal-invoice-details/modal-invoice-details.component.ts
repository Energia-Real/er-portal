import { Subject } from 'rxjs';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ColumnDefinition, CellComponent, Options } from 'tabulator-tables';
import { InvoiceTableService } from '@app/pages/billing-main/billing-table.service';

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
  
  constructor(private invoiceTableService: InvoiceTableService) {}

  ngOnInit(): void {
      const { columns, options } = this.invoiceTableService.getTableColumnsWithActions({
        downloadPdf: (row) => this.downloadPdf(row),
        downloadXml: (row) => this.downloadXml(row),
        viewDetails: (row) => this.viewDetails(row)
      });
    
      this.tableConfig = {
        ...options, // Esto incluye las opciones de la tabla como maxHeight, layout, etc.
        columns: columns // Esto incluye las columnas con acciones
      };
    
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
    }, 500);
  }

  downloadPdf(row: any) {
    console.log('downloadPdf');
  }
  
  downloadXml(row: any) {
    console.log('downloadXml');
    
  }
  viewDetails(row: any) {
    console.log('viewDetails');
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
