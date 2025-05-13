import { Injectable } from "@angular/core";
import { CellComponent, ColumnDefinition, Options } from "tabulator-tables";
import * as entity from './billing-model';
import { FormatsService } from "@app/shared/services/formats.service";

@Injectable({ providedIn: 'root' })
export class InvoiceTableService {

  constructor(private formatService: FormatsService) { }

  getTableColumnsInvoiceDetails(): ColumnDefinition[] {
    return [
      {
        title: "Planta",
        field: "siteName",
        headerSort: false,
        vertAlign: "middle",
        minWidth: 150,
        cssClass: "wrap-text-cell"
      },
      {
        title: "Cliente",
        field: "clientName",
        headerSort: false,
        vertAlign: "middle",
        minWidth: 100,
        cssClass: "wrap-text-cell"
      },
      {
        title: "Razón Social",
        field: "legalName",
        headerSort: false,
        vertAlign: "middle",
        width: 200,
        cssClass: "wrap-text-cell"
      },
      {
        title: "Producto",
        field: "product",
        minWidth: 150,
        hozAlign: "left",
        headerSort: false,
        vertAlign: "middle",
        cssClass: "wrap-text-cell"
      },
      {
        title: "Tipo Contrato",
        field: "contractType",
        minWidth: 120,
        hozAlign: "left",
        headerSort: false,
        vertAlign: "middle",
        cssClass: "wrap-text-cell"
      },
      {
        title: "Estatus",
        field: "status",
        minWidth: 100,
        headerSort: false,
        vertAlign: "middle",
        cssClass: "wrap-text-cell"

      },
      {
        title: "Dirección",
        field: "address",
        minWidth: 250,
        headerSort: false,
        vertAlign: "middle",
        cssClass: "wrap-text-cell"
      }
    ];

  }

  getTableOptionsInvoiceDetails(): Options {
    return {
      maxHeight: 280,
      layout: "fitColumns",
      columns: this.getTableColumnsInvoiceDetails(),
      movableColumns: true,
    };
  }

  getTableColumnsWithActions(callbacks: {
    downloadPdf: (row: entity.InvoiceDetailsTableRow) => void,
    downloadXml: (row: entity.InvoiceDetailsTableRow) => void,
    viewDetails: (row: entity.InvoiceDetailsTableRow) => void
  }): { columns: ColumnDefinition[], options: Options } {
    // Definimos las columnas
    const columns: ColumnDefinition[] = [
      ...this.getTableColumnsInvoiceDetails(),
      {
        title: 'Action',
        field: 'actions',
        minWidth: 180,
        formatter: (cell: CellComponent) => {
          return `
            <div style="display: flex; justify-content: space-around; align-items: center;">
              <img src="assets/svg/pdf-download.svg" class="action-icon" data-action="downloadPdf" style="cursor:pointer; margin:0 18px;" title="Download PDF">
              <img src="assets/svg/xml-download.svg" class="action-icon" data-action="downloadXml" style="cursor:pointer; margin:0 18px;" title="Download XML">
              <img src="assets/img/eye-open-orange.png" class="action-icon" data-action="viewDetails" style="cursor:pointer; margin:0 18px;" title="View Details">
            </div>
          `;
        },
        cellClick: (e: any, cell: CellComponent) => {
          const element = e.target as HTMLElement;
          if (element.classList.contains('action-icon')) {
            const action = element.getAttribute('data-action');
            const row = cell.getRow().getData() as entity.InvoiceDetailsTableRow;

            switch (action) {
              case 'downloadPdf':
                callbacks.downloadPdf(row);
                break;
              case 'downloadXml':
                callbacks.downloadXml(row);
                break;
              case 'viewDetails':
                callbacks.viewDetails(row);
                break;
            }
          }
        },
        headerSort: false,
        vertAlign: "middle"
      }
    ];

    // Definimos las opciones de la tabla
    const options: Options = {
      maxHeight: 280,
      layout: "fitColumns",
      columns: columns,
      movableColumns: true
    };

    return { columns, options };
  }

  getTableColumnsSites(): ColumnDefinition[] {
    return [
      {
        title: "Site name",
        field: "siteName",
        headerSort: false,
        vertAlign: "middle",
        minWidth: 200,
        maxWidth: 200,
        cssClass: "wrap-text-cell"
      },
      {
        title: "Client name",
        field: "clientName",
        headerSort: false,
        vertAlign: "middle",
        minWidth: 200,
        maxWidth: 200,
        hozAlign: "left",
        cssClass: "wrap-text-cell"
      },
      {
        title: "Legal name",
        field: "legalName",
        headerSort: false,
        vertAlign: "middle",
        hozAlign: "left",
        minWidth: 200,
        maxWidth: 200,
        cssClass: "wrap-text-cell"
      },
      {
        title: "Product / modality",
        field: "product",
        minWidth: 200,
        maxWidth: 200,
        hozAlign: "center",
        headerSort: false,
        vertAlign: "middle",
        cssClass: "wrap-text-cell"
      },
      {
        title: "Address",
        field: "address",
        minWidth: 200,
        hozAlign: "left",
        headerSort: false,
        vertAlign: "middle",
        cssClass: "wrap-text-cell"
      }
    ];
  }

  getTableOptionsSites(): Options {
    return {
      maxHeight: 280,
      layout: "fitColumns",
      columns: this.getTableColumnsSites(),
      movableColumns: true,
    };
  }
}
