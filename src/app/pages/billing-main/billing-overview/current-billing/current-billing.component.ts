import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DrawerGeneral, GeneralResponse, notificationData, NotificationServiceData } from '@app/shared/models/general-models';
import { Store } from '@ngrx/store';
import { Subject, Subscription, switchMap, takeUntil } from 'rxjs';
import { ColumnDefinition, Options } from 'tabulator-tables';
import { BillingService } from '../../billing.service';
import { Bill, CurrentBillResponse, DownloadBillingResponse } from '../../billing-model';
import { TabulatorTableComponent } from '@app/shared/components/tabulator-table/tabulator-table.component';
import { TranslationService } from '@app/shared/services/i18n/translation.service';
import { selectDrawer } from '@app/core/store/selectors/drawer.selector';
import { updateDrawer } from '@app/core/store/actions/drawer.actions';
import { InvoiceTableService } from '../../billing-table.service';
import { NotificationDataService } from '@app/shared/services/notificationData.service';
import { EncryptionService } from '@app/shared/services/encryption.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { NOTIFICATION_CONSTANTS } from '@app/core/constants/notification-constants';
import { MatDialog } from '@angular/material/dialog';
import { NotificationComponent } from '@app/shared/components/notification/notification.component';

@Component({
  selector: 'app-current-billing',
  templateUrl: './current-billing.component.html',
  styleUrl: './current-billing.component.scss',
  standalone: false
})
export class CurrentBillingComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();

  @ViewChild(TabulatorTableComponent) tabulatorTable!: TabulatorTableComponent;

  ERROR = NOTIFICATION_CONSTANTS.ERROR_TYPE;

  bills!: Bill[];

  tableConfig!: Options;
  columns: ColumnDefinition[] = [];

  drawerOpenSub: Subscription;
  drawerOpenID: boolean = false;
  drawerAction: "Create" | "Edit" | "View" = "Create";
  drawerInfo: any | null | undefined = null;

  isLoading: boolean = true;

  constructor(
    private store: Store,
    private invoiceTableService: InvoiceTableService,
    private moduleServices: BillingService,
    private translationService: TranslationService,
    private notificationDataService: NotificationDataService,
    private encryptionService: EncryptionService,
    private notificationsService: NotificationService,
    private dialog: MatDialog
  ) {
    this.drawerOpenSub = this.store.select(selectDrawer).pipe(takeUntil(this.onDestroy$)).subscribe((resp: DrawerGeneral) => {
      this.drawerOpenID = resp.drawerOpen;
      this.drawerAction = resp.drawerAction;
      this.drawerInfo = resp.drawerInfo;
    });
  }

  ngOnInit(): void {
    this.loadTableColumns();
    this.getBilling();
  }

  private downloadBase64File(base64: string, fileName: string, fileType: string): void {
    console.log(fileType)
    try {
      // Create a blob from the base64 string
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/" + fileType });

      // Create a link element and trigger the download
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      link.click();

      // Clean up
      window.URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  }

  loadTableColumns() {
    this.translationService.currentLang$
      .pipe(
        takeUntil(this.onDestroy$),
        switchMap(() => {
          // Create callbacks object using component methods
          const callbacks = {
            downloadPdf: (row: any) => this.downloadPdf(row),
            downloadXml: (row: any) => this.downloadXml(row),
            viewDetails: (row: any) => this.viewDetails(row)
          };
          return this.invoiceTableService.getTableOptionsCurrentBillings(callbacks);
        })
      )
      .subscribe({
        next: (options) => {
          this.tableConfig = { ...options };

          if (this.tabulatorTable) this.tabulatorTable.updateColumns();
        },
        error: (err) => {
          console.error('Error al cargar la configuración de la tabla:', err);
        }
      });
  }

  getBilling() {
    this.moduleServices.getCurrentInvoices().subscribe({
      next: (response: GeneralResponse<CurrentBillResponse>) => {
        console.log(response)
        this.bills = response.response.currentBillResponse;
        this.isLoading = false;
      },
      error: (error) => {
        console.log(error);
        this.isLoading = false;
      }
    });
  }

  // Action methods for the icons
  downloadPdf(row: any): void {
    console.log('Download PDF clicked for:', row);
    if (row.billingId == "" || row.billingId == null) {
      this.moduleServices.downloadBillingADX("pdf", row.fiscalId, row.year, row.month).subscribe({
        next: (resp: any) => {
          this.downloadBase64File(resp.response.base64, resp.response.fileName, resp.response.fileType);
        },
        error: (error) => {
          const errorArray = error?.error?.errors?.errors ?? [];
          if (errorArray.length) this.createNotificationError(this.ERROR, errorArray[0].title, errorArray[0].descripcion, errorArray[0].warn);
        }
      })
    } else {
      this.moduleServices.downloadBillingNetsuite("pdf", row.billingId).subscribe({
        next: (resp: GeneralResponse<DownloadBillingResponse>) => {
          this.downloadBase64File(resp.response.base64, resp.response.fileName, resp.response.fileType);
        },
        error: (error) => {
          const errorArray = error?.error?.errors?.errors ?? [];
          if (errorArray.length) this.createNotificationError(this.ERROR, errorArray[0].title, errorArray[0].descripcion, errorArray[0].warn);
        }
      })
    }
  }

  downloadXml(row: any): void {
    console.log('Download XML clicked for:', row);
    if (row.billingId == "" || row.billingId == null) {
      this.moduleServices.downloadBillingADX("xml", row.fiscalId, row.year, row.month).subscribe({
        next: (resp: GeneralResponse<DownloadBillingResponse>) => {
          this.downloadBase64File(resp.response.base64, resp.response.fileName, resp.response.fileType);
        },
        error: (error) => {
          const errorArray = error?.error?.errors?.errors ?? [];
          if (errorArray.length) this.createNotificationError(this.ERROR, errorArray[0].title, errorArray[0].descripcion, errorArray[0].warn);
        }
      })
    } else {
      this.moduleServices.downloadBillingNetsuite("xml", row.billingId).subscribe({
        next: (resp: any) => {
          this.downloadBase64File(resp.response.base64, resp.response.fileName, resp.response.fileType);
        },
        error: (error) => {
          const errorArray = error?.error?.errors?.errors ?? [];
          if (errorArray.length) this.createNotificationError(this.ERROR, errorArray[0].title, errorArray[0].descripcion, errorArray[0].warn);
        }
      })
    }
  }

  viewDetails(row: any): void {
    this.drawerInfo = row
    this.updDraweStateView(true);
  }

  updDraweStateView(estado: boolean): void {
    this.store.dispatch(updateDrawer({ drawerOpen: estado, drawerAction: "View", drawerInfo: this.drawerInfo, needReload: false }));
  }

  descargarTabla(tipo: string) {
    this.tabulatorTable.download(tipo);
  }

  createNotificationError(notificationType: string, title?: string, description?: string, warn?: string) {
    const dataNotificationModal: notificationData | undefined = this.notificationDataService.uniqueError();
    dataNotificationModal!.title = title;
    dataNotificationModal!.content = description;
    dataNotificationModal!.warn = warn; // ESTOS PARAMETROS SE IGUALAN AQUI DEBIDO A QUE DEPENDEN DE LA RESPUESTA DEL ENDPOINT
    const encryptedData = localStorage.getItem('userInfo');
    if (encryptedData) {
      const userInfo = this.encryptionService.decryptData(encryptedData);
      let dataNotificationService: NotificationServiceData = { //INFORMACION NECESARIA PARA DAR DE ALTA UNA NOTIFICACION EN SISTEMA
        userId: userInfo.id,
        descripcion: description,
        notificationTypeId: dataNotificationModal?.typeId,
        notificationStatusId: this.notificationsService.getNotificationStatusByName(NOTIFICATION_CONSTANTS.COMPLETED_STATUS).id //EL STATUS ES COMPLETED DEBIDO A QUE EN UN ERROR NO ESPERAMOS UNA CONFIRMACION O CANCELACION(COMO PUEDE SER EN UN ADD, EDIT O DELETE)
      }
      this.notificationsService.createNotification(dataNotificationService).subscribe(res => {
      })
    }

    this.dialog.open(NotificationComponent, {
      width: '540px',
      data: dataNotificationModal
    });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
