import { Subject } from 'rxjs';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Options } from 'tabulator-tables';
import { InvoiceTableService } from '@app/pages/billing-main/billing-table.service';
import * as entity from '../../../billing-model';

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
    if (!invoiceData) return;
    console.log(invoiceData);
  }

  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageSize: number = 10;
  pageIndex: number = 1;
  totalItems: number = 0;

  invoicesDetails: entity.InvoiceDetailsTableRow [] = [];
  tableConfig: Options = {};
  
  constructor(private invoiceTableService: InvoiceTableService) {}

  ngOnInit(): void {
      // const { columns, options } = this.invoiceTableService.getTableOptionsInvoiceDetails({
      //   downloadPdf: (row:entity.InvoiceDetailsTableRow ) => this.downloadPdf(row),
      //   downloadXml: (row:entity.InvoiceDetailsTableRow ) => this.downloadXml(row),
      //   viewDetails: (row:entity.InvoiceDetailsTableRow ) => this.viewDetails(row)
      // });
    
      // this.tableConfig = {
      //   ...options, // Esto incluye las opciones de la tabla como maxHeight, layout, etc...
      //   columns: columns // Esto incluye las columnas con acciones
      // };

     
    this.tableConfig = this.invoiceTableService.getTableOptionsInvoiceDetails()
    
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

  downloadPdf(row: entity.InvoiceDetailsTableRow ) {
    console.log(row);
    console.log('downloadPdf');
  }
  
  downloadXml(row: entity.InvoiceDetailsTableRow ) {
    console.log(row);
    console.log('downloadXml');
    
  }
  viewDetails(row: entity.InvoiceDetailsTableRow ) {
    console.log(row);
    console.log('viewDetails');
  }

  getServerData(event: any){
    console.log(event)
  }
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
