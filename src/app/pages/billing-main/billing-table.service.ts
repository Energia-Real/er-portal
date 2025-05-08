import { Injectable } from "@angular/core";
import { CellComponent, ColumnDefinition, Options } from "tabulator-tables";

@Injectable({ providedIn: 'root' })
export class InvoiceTableService {
 
  getTableColumnsInvoiceDetails(): ColumnDefinition[] {
    return [
      {
        title: "Production",
        field: "production",
        headerSort: false,
        vertAlign: "middle",
        minWidth: 120,
        hozAlign: "right",
        formatter: (cell: CellComponent) => this.formatNumber(cell.getValue())
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
        formatter: (cell: CellComponent) => this.formatCurrency(cell.getValue()),
        hozAlign: "left",
        headerSort: false,
        vertAlign: "middle"
      },
      {
        title: "Taxes",
        field: "taxes",
        minWidth: 150,
        formatter: (cell: CellComponent) => this.formatCurrency(cell.getValue()),
        hozAlign: "left",
        headerSort: false,
        vertAlign: "middle"
      },
      {
        title: "Total Amount",
        field: "amount",
        minWidth: 150,
        formatter: (cell: CellComponent) => this.formatCurrency(cell.getValue()),
        hozAlign: "left",
        headerSort: false,
        vertAlign: "middle"
      },
    ];
  }

  getTableColumnsWithActions(callbacks: {
    downloadPdf: (row: any) => void,
    downloadXml: (row: any) => void,
    viewDetails: (row: any) => void
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
            const row = cell.getRow().getData();
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
  
  // FORMATOS 
   // Función pública para formatear moneda
   formatCurrency(value: number): string {
    const formatted = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 2
    }).format(value || 0);
    return `${formatted}`;
  }

  // Función pública para formatear números con decimales
  formatNumber(value: number): string {
    return value.toLocaleString('es-MX', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

}
