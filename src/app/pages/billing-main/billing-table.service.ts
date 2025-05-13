import { Injectable } from "@angular/core";
import { CellComponent, ColumnDefinition, Options } from "tabulator-tables";
import * as entity from './billing-model';
import { FormatsService } from "@app/shared/services/formats.service";
import { TranslationService } from "@app/shared/services/i18n/translation.service";
import { forkJoin, map, Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class InvoiceTableService {

  constructor(
    private formatService: FormatsService,
    private translationService: TranslationService
  ) { }

  getTableColumnsInvoiceDetails(): Observable<ColumnDefinition[]> {
    const keys = [
      'FACTURACION.PRODUCCION',
      'FACTURACION.CONCEPTO',
      'FACTURACION.DESCRIPCION',
      'FACTURACION.VALOR_UNITARIO',
      'FACTURACION.IMPUESTOS',
      'FACTURACION.MONTO_TOTAL'
    ];

    const translationObservables = keys.map(key =>
      this.translationService.getTranslation(key)
    );

    return forkJoin(translationObservables).pipe(
      map(([production, concept, description, unitValue, taxes, totalAmount]) => [
        {
          title: production,
          field: "production",
          minWidth: 130,
          hozAlign: "right",
          headerSort: false,
          vertAlign: "middle",
          cssClass: "wrap-text-cell"
        },
        {
          title: concept,
          field: "concept",
          minWidth: 180,
          hozAlign: "left",
          headerSort: false,
          vertAlign: "middle",
          cssClass: "wrap-text-cell"
        },
        {
          title: description,
          field: "description",
          minWidth: 250,
          hozAlign: "left",
          headerSort: false,
          vertAlign: "middle",
          cssClass: "wrap-text-cell"
        },
        {
          title: unitValue,
          field: "unitValue",
          minWidth: 130,
          hozAlign: "right",
          headerSort: false,
          vertAlign: "middle",
          cssClass: "wrap-text-cell"
        },
        {
          title: taxes,
          field: "taxes",
          minWidth: 120,
          hozAlign: "right",
          headerSort: false,
          vertAlign: "middle",
          cssClass: "wrap-text-cell"
        },
        {
          title: totalAmount,
          field: "totalAmount",
          minWidth: 140,
          hozAlign: "right",
          headerSort: false,
          vertAlign: "middle",
          cssClass: "wrap-text-cell"
        }
      ])
    );
  }

  getTableOptionsInvoiceDetails(): Observable<Options> {
    return this.getTableColumnsInvoiceDetails().pipe(
      map((columns) => ({
        maxHeight: 280,
        layout: "fitColumns",
        columns,
        movableColumns: true,
      }))
    );
  }

  getTableColumnsWithActions(callbacks: {
    downloadPdf: (row: entity.InvoiceDetailsTableRow) => void,
    downloadXml: (row: entity.InvoiceDetailsTableRow) => void,
    viewDetails: (row: entity.InvoiceDetailsTableRow) => void
  }): { columns: ColumnDefinition[], options: Options } {
    // Definimos las columnas
    const columns: ColumnDefinition[] = [
      // ...this.getTableColumnsInvoiceDetails(),
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

  getTableColumnsSites(): Observable<ColumnDefinition[]> {
    const keys = [
      'FACTURACION.NOMBRE_SITIO',
      'FACTURACION.NOMBRE_CLIENTE',
      'FACTURACION.NOMBRE_LEGAL',
      'FACTURACION.PRODUCTO_MODALIDAD',
      'FACTURACION.DIRECCION'
    ];

    const translationObservables = keys.map(key =>
      this.translationService.getTranslation(key)
    );

    return forkJoin(translationObservables).pipe(
      map(([siteName, clientName, legalName, product, address]) => [
        {
          title: siteName,
          field: "siteName",
          headerSort: false,
          vertAlign: "middle",
          minWidth: 200,
          cssClass: "wrap-text-cell"
        },
        {
          title: clientName,
          field: "clientName",
          headerSort: false,
          vertAlign: "middle",
          minWidth: 200,
          hozAlign: "left",
          cssClass: "wrap-text-cell"
        },
        {
          title: legalName,
          field: "legalName",
          headerSort: false,
          vertAlign: "middle",
          hozAlign: "left",
          minWidth: 200,
          cssClass: "wrap-text-cell"
        },
        {
          title: product,
          field: "product",
          minWidth: 200,
          hozAlign: "center",
          headerSort: false,
          vertAlign: "middle",
          cssClass: "wrap-text-cell"
        },
        {
          title: address,
          field: "address",
          minWidth: 200,
          hozAlign: "left",
          headerSort: false,
          vertAlign: "middle",
          cssClass: "wrap-text-cell"
        }
      ])
    );
  }

  getTableOptionsSites(): Observable<Options> {
    return this.getTableColumnsSites().pipe(
      map((columns) => ({
        maxHeight: 280,
        layout: "fitColumns",
        columns,
        movableColumns: true,
      }))
    );
  }
}
