import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Subject, Subscription, switchMap, takeUntil } from 'rxjs';
import * as entity from '../../../billing-model';
import { BillingService } from '@app/pages/billing-main/billing.service';
import { DrawerGeneral, GeneralFilters, GeneralPaginatedResponse, GeneralResponse, notificationData, NotificationServiceData } from '@app/shared/models/general-models';
import { ColumnDefinition, Options } from 'tabulator-tables';
import { TranslationService } from '@app/shared/services/i18n/translation.service';
import { TabulatorTableComponent } from '@app/shared/components/tabulator-table/tabulator-table.component';
import { InvoiceTableService } from '@app/pages/billing-main/billing-table.service';
import { Store } from '@ngrx/store';
import { selectDrawer } from '@app/core/store/selectors/drawer.selector';
import { updateDrawer } from '@app/core/store/actions/drawer.actions';
import { start } from '@popperjs/core';
import { NotificationDataService } from '@app/shared/services/notificationData.service';
import { EncryptionService } from '@app/shared/services/encryption.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationComponent } from '@app/shared/components/notification/notification.component';
import { NOTIFICATION_CONSTANTS } from '@app/core/constants/notification-constants';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-billing-history',
  templateUrl: './billing-history.component.html',
  styleUrl: './billing-history.component.scss',
  standalone: false
})
export class BillingHistoryComponent implements OnInit, OnDestroy, OnChanges {

  ERROR = NOTIFICATION_CONSTANTS.ERROR_TYPE;

  private onDestroy$ = new Subject<void>();

  @ViewChild(TabulatorTableComponent) tabulatorTable!: TabulatorTableComponent;
  @Input() filterData!: entity.BillingOverviewFilterData;

  pageSizeOptions: number[] = [1, 2, 3, 5];
  pageSize: number = 10;
  pageIndex: number = 0;
  totalItems: number = 0;

  bills: entity.Bill[] = [];

  tableConfig!: Options;
  columns: ColumnDefinition[] = [];

  drawerOpenSub: Subscription;
  drawerOpenID: boolean = false;
  drawerAction: "Create" | "Edit" | "View" = "Create";
  drawerInfo: any | null | undefined = null;

  isLoading: Boolean = true;

  constructor(
    private store: Store<{ filters: GeneralFilters }>,
    private moduleService: BillingService,
    private translationService: TranslationService,
    private invoiceTableService: InvoiceTableService,
    private notificationDataService: NotificationDataService,
    private encryptionService: EncryptionService,
    private notificationsService: NotificationService,
    private dialog: MatDialog,

  ) {
    this.drawerOpenSub = this.store.select(selectDrawer).pipe(takeUntil(this.onDestroy$)).subscribe((resp: DrawerGeneral) => {
      this.drawerOpenID = resp.drawerOpen;
      this.drawerAction = resp.drawerAction;
      this.drawerInfo = resp.drawerInfo;
    });
  }

  ngOnInit(): void {
    this.loadTableColumns();
    this.getFilters();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filterData'] && !changes['filterData'].firstChange) {
      const prev = changes['filterData'].previousValue;
      const curr = changes['filterData'].currentValue;
      if (JSON.stringify(prev) !== JSON.stringify(curr)) this.getFilters();
    }
  }

  loadTableColumns() {
    this.translationService.currentLang$
      .pipe(
        takeUntil(this.onDestroy$),
        switchMap(() => {
          const callbacks = {
            downloadPdf: (row: any) => this.downloadPdf(row),
            downloadXml: (row: any) => this.downloadXml(row),
            // viewDetails: (row: any) => this.viewDetails(row)
          };
          return this.invoiceTableService.getTableOptionsHistoryBillings(callbacks);
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

  getFilters() {
    const filters: entity.BillingOverviewFilterData = {
      customerNames: this.filterData?.customerNames ?? [],
      legalName: this.filterData?.legalName ?? [],
      productType: this.filterData?.productType ?? [],
      startDate: this.filterData?.startDate ?? '',
      endDate: this.filterData?.endDate ?? '',
      pageSize: this.pageSize,
      page: this.pageIndex + 1
    };

    this.getBillingHistory(filters);
  }

  getBillingHistory(filters: entity.BillingOverviewFilterData) {
    this.moduleService.getBillingHistory(filters).subscribe({
      next: (response: GeneralPaginatedResponse<entity.Bill>) => {
        this.bills = response.data;
        this.totalItems = response.totalItems;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.log(error);
      }
    });
  }

 getServerData(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.getFilters();
  }

  private downloadBase64File(base64: string, fileName: string, fileType: string): void {
    try {
      // Create a blob from the base64 string
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/"+fileType });
      
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

  // Action methods for the icons
  downloadPdf(row: any): void {
    console.log('Download PDF clicked for:', row);
    if(row.billingId=="" || row.billingId==null){
      this.moduleService.downloadBillingADX("pdf",row.fiscalId,row.year,row.month).subscribe({
        next:(resp:any) =>{
          this.downloadBase64File(resp.response.base64, resp.response.fileName, resp.response.fileType);
        },
        error: (error) => {
          const errorArray = error?.error?.errors?.errors ?? [];
          if (errorArray.length) this.createNotificationError(this.ERROR, errorArray[0].title, errorArray[0].descripcion, errorArray[0].warn);
        }
      })
    }else{
      this.moduleService.downloadBillingNetsuite("pdf",row.billingId).subscribe({
        next:(resp:GeneralResponse<entity.DownloadBillingResponse>) =>{
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
    if(row.billingId=="" || row.billingId==null){
      this.moduleService.downloadBillingADX("xml",row.fiscalId,row.year,row.month).subscribe({
        next:(resp:GeneralResponse<entity.DownloadBillingResponse>) =>{
          this.downloadBase64File(resp.response.base64, resp.response.fileName, resp.response.fileType);
        },
        error: (error) => {
          const errorArray = error?.error?.errors?.errors ?? [];
          if (errorArray.length) this.createNotificationError(this.ERROR, errorArray[0].title, errorArray[0].descripcion, errorArray[0].warn);
        }
      })
    }else{
      this.moduleService.downloadBillingNetsuite("xml",row.billingId).subscribe({
        next:(resp:GeneralResponse<entity.DownloadBillingResponse>) =>{
          this.downloadBase64File(resp.response.base64, resp.response.fileName, resp.response.fileType);
        },
        error: (error) => {
          const errorArray = error?.error?.errors?.errors ?? [];
          if (errorArray.length) this.createNotificationError(this.ERROR, errorArray[0].title, errorArray[0].descripcion, errorArray[0].warn);
        }
      })
    }
  }

  descargarTabla(tipo: string) {
    this.tabulatorTable.download(tipo);
  }

  viewDetails(row: any): void {
    this.drawerInfo = row;
    this.updDraweStateView(true);
  }

  updDraweStateView(estado: boolean): void {
    this.store.dispatch(updateDrawer({ drawerOpen: estado, drawerAction: "View", drawerInfo: this.drawerInfo, needReload: false }));
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
