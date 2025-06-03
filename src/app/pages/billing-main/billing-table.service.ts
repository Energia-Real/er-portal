import { Injectable } from "@angular/core";
import { CellComponent, ColumnDefinition, Options } from "tabulator-tables";
import * as entity from './billing-model';
import { FormatsService } from "@app/shared/services/formats.service";
import { TranslationService } from "@app/shared/services/i18n/translation.service";
import { forkJoin, map, Observable } from "rxjs";
import { MonthAbbreviationPipe } from "@app/shared/pipes/month-abbreviation.pipe";

@Injectable({ providedIn: 'root' })
export class InvoiceTableService {

  constructor(
    private formatService: FormatsService,
    private translationService: TranslationService
  ) { }
  private monthAbbrPipe = new MonthAbbreviationPipe();


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

  getTableColumnsCurrentBillings(
    callbacks: {
      downloadPdf: (row: entity.CurrentBillingTableRow) => void,
      downloadXml: (row: entity.CurrentBillingTableRow) => void,
      // viewDetails: (row: entity.CurrentBillingTableRow) => void
    }
  ): Observable<ColumnDefinition[]> {

    const keys = [
      'FACTURACION.NOMBRE_LEGAL',
      'FACTURACION.AÑO',
      'FACTURACION.MES',
      'FACTURACION.ESTADO',
      'FACTURACION.PRODUCTO',
      'FACTURACION.MONTO',
      'FACTURACION.ACCION'
    ];

    const translationObservables = keys.map(key =>
      this.translationService.getTranslation(key)
    );

    return forkJoin(translationObservables).pipe(
      map(([legalName, year, month, status, product, amount, action]) => [
        {
          title: legalName,
          field: "legalName",
          headerSort: false,
          vertAlign: "middle",
          minWidth: 150,
          cssClass: "wrap-text-cell"
        },
        {
          title: year,
          field: "year",
          headerSort: false,
          vertAlign: "middle",
          minWidth: 80,
        },
        {
          title: month,
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
          title: status,
          field: "status",
          minWidth: 105,
          formatter: (cell: CellComponent) => {
            const value = cell.getValue();
            // Define colors for different status IDs
            const statusColors: { [key: string]: { bg: string, text: string } } = {
              "Payed": { bg: "#33A02C", text: "white" },      // Green - Paid in full
              "Overdue": { bg: "#E31A1C", text: "white" },    // Orange - Pendiente/Partially paid
              "Pending": { bg: "#E5B83E", text: "white" },
              "PayedLate": { bg: "#EE5427", text: "white" }     // Red - Open
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
            } else if (value === "PayedLate") {
              translatedValue = this.translationService.instant('FACTURACION.PAGO_TARDIO');
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
              width: 120px;
              
              height: 35px
            ">${translatedValue}</span>`;
          },
          hozAlign: "left",
          headerSort: false,
          vertAlign: "middle"
        },
        {
          title: product,
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
          title: amount,
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
          title: action,
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
              </div>
              `;
            // <img src="assets/svg/icon-eye.svg" class="action-icon" data-action="viewDetails" style="cursor:pointer; margin:0 18px; " title="${viewDetailsTitle}">
          },
          cellClick: (e: any, cell: CellComponent) => {
            // Get the clicked element
            const element = e.target as HTMLElement;

            // Check if it's one of our action icons
            if (element.classList.contains('action-icon')) {
              const action = element.getAttribute('data-action');
              const row = cell.getRow().getData() as entity.CurrentBillingTableRow;

              // Call the appropriate function based on the action
              switch (action) {
                case 'downloadPdf':
                  callbacks.downloadPdf(row);
                  break;
                case 'downloadXml':
                  callbacks.downloadXml(row);
                  break;
                // case 'viewDetails':
                //   callbacks.viewDetails(row);
                //   break;
              }
            }
          },
          headerSort: false,
          vertAlign: "middle"
        }
      ])
    );
  }

  getTableOptionsInvoiceDetails(): Observable<Options> {
    return this.getTableColumnsInvoiceDetails().pipe(
      map((columns) => ({
        maxHeight: 490,
        layout: "fitColumns",
        columns,
        movableColumns: true,
      }))
    );
  }

  getTableOptionsCurrentBillings(callbacks: {
    downloadPdf: (row: entity.CurrentBillingTableRow) => void,
    downloadXml: (row: entity.CurrentBillingTableRow) => void,
    viewDetails: (row: entity.CurrentBillingTableRow) => void
  }): Observable<Options> {
    return this.getTableColumnsCurrentBillings(callbacks).pipe(
      map((columns) => ({
        maxHeight: 280,
        layout: "fitColumns",
        rowHeader: {
          headerSort: false,
          resizable: false,
          frozen: true,
          headerHozAlign: "center",
          hozAlign: "left",
          formatter: "rowSelection",
          titleFormatter: "rowSelection",
          cellClick: function (e, cell) {
            cell.getRow().toggleSelect();
          },
          width: 50
        },
        downloadRowRange: "selected",
        columns: columns,
        movableColumns: true,
      }))
    );
  }

  getTableOptionsHistoryBillings(callbacks: {
    downloadPdf: (row: entity.CurrentBillingTableRow) => void,
    downloadXml: (row: entity.CurrentBillingTableRow) => void,
    // viewDetails: (row: entity.CurrentBillingTableRow) => void
  }): Observable<Options> {
    return this.getTableColumnsCurrentBillings(callbacks).pipe(
      map((columns) => ({
        maxHeight: 550,
        layout: "fitColumns",
        rowHeader: {
          headerSort: false,
          resizable: false,
          frozen: true,
          headerHozAlign: "center",
          hozAlign: "left",
          formatter: "rowSelection",
          titleFormatter: "rowSelection",
          cellClick: function (e, cell) {
            cell.getRow().toggleSelect();
          },
          width: 50
        },
        downloadRowRange: "selected",
        columns: columns,
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
              </div>
              `;
          // <img src="assets/img/eye-open-orange.png" class="action-icon" data-action="viewDetails" style="cursor:pointer; margin:0 18px;" title="View Details">
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
              // case 'viewDetails':
              //   callbacks.viewDetails(row);
              //   break;
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
          cssClass: "wrap-text-cell",
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
          field: "productType",
          maxWidth: 200,
          formatter: (cell: CellComponent) => {
            const value: string[] = cell.getValue();
            if (!Array.isArray(value)) return '';

            const iconMap: Record<string, { color: string; icon: string; title: string }> = {
              Solar: { color: "#EE5427", icon: "assets/svg/sun.svg", title: "Solar" },
              BESS: { color: "#57B1B1", icon: "assets/svg/battery.svg", title: "BESS" },
              MEM: { color: "#792430", icon: "assets/svg/mem.svg", title: "MEM" }
            };

            const badges = value.map((type) => {
              const config = iconMap[type];
              if (!config) return '';
              return `
                <span style="
                    color: white;
                    background-color: ${config.color};
                    border-radius: 16px;
                    padding: 4px 10px;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 48px;
                    height: 35px;
                    margin-bottom: 10px;">
                  <img src="${config.icon}" title="${config.title}">
                </span>`;
            }).join('');

            return `<div>${badges}</div>`;
          },
          hozAlign: "center",
          headerSort: false,
          vertAlign: "middle"
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
        maxHeight: 550,
        layout: "fitColumns",
        columns,
        movableColumns: true,
      }))
    );
  }
}
