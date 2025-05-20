import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FinantialStepperComponent } from '../finantial-stepper/finantial-stepper.component';
import { FinantialDataModelStepper } from '../finantial-model-model';
import { FinantialService } from '../finantial.service';
import { NOTIFICATION_CONSTANTS } from '@app/core/constants/notification-constants';
import { EditNotificationStatus, notificationData, NotificationMessages, NotificationServiceData } from '@app/shared/models/general-models';
import { NotificationDataService } from '@app/shared/services/notificationData.service';
import { EncryptionService } from '@app/shared/services/encryption.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { NotificationComponent } from '@app/shared/components/notification/notification.component';
import { Subject, fromEvent } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { Tabulator } from 'tabulator-tables';
import { TranslationService } from '@app/shared/services/i18n/translation.service';
import * as d3 from 'd3';

interface FinancialDataPoint {
  date: Date;
  value: number;
  category: string;
  type?: 'bar' | 'line'; // Tipo de visualización para gráficos combinados
}

interface CategoryData {
  category: string;
  value: number;
  date: Date;
}

@Component({
    selector: 'app-finantial-model-layout',
    templateUrl: './finantial-model-layout.component.html',
    styleUrl: './finantial-model-layout.component.scss',
    standalone: false
})
export class FinantialModelLayoutComponent implements OnInit, OnDestroy, AfterViewInit {

  exTable: any;
  filterParam: string = '';

  private onDestroy$ = new Subject<void>();
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('chartContainer') chartContainer!: ElementRef;
  
  selectedFile: File | null = null;
  processStatus: string | null = null;
  scenarios: number | null = null;
  fileId: string | null = null;
  private notificationId?: string;

  // Propiedades para D3.js
  chartType: "line"|"bar" | "area" |"bar-line" = 'bar-line';
  financialData: FinancialDataPoint[] = [];
  
  // Datos de ejemplo para el gráfico combinado
  monthlyData = [
    {
      "month": 1,
      "billedEnergyAmouth": 1143.83,
      "billedEnergyProduced": 658,
      "billedEnergy": 1374
    },
    {
      "month": 2,
      "billedEnergyAmouth": 1143.83,
      "billedEnergyProduced": 944,
      "billedEnergy": 765
    },
    {
      "month": 3,
      "billedEnergyAmouth": 1143.83,
      "billedEnergyProduced": 225,
      "billedEnergy": 1403
    },
    {
      "month": 4,
      "billedEnergyAmouth": 1143.83,
      "billedEnergyProduced": 1463,
      "billedEnergy": 1433
    },
    {
      "month": 5,
      "billedEnergyAmouth": 1143.83,
      "billedEnergyProduced": 486,
      "billedEnergy": 956
    },
    {
      "month": 6,
      "billedEnergyAmouth": 1143.83,
      "billedEnergyProduced": 927,
      "billedEnergy": 325
    },
    {
      "month": 7,
      "billedEnergyAmouth": 1143.83,
      "billedEnergyProduced": 157,
      "billedEnergy": 541
    },
    {
      "month": 8,
      "billedEnergyAmouth": 1143.83,
      "billedEnergyProduced": 817,
      "billedEnergy": 996
    },
    {
      "month": 9,
      "billedEnergyAmouth": 1143.83,
      "billedEnergyProduced": 175,
      "billedEnergy": 1206
    },
    {
      "month": 10,
      "billedEnergyAmouth": 1143.83,
      "billedEnergyProduced": 590,
      "billedEnergy": 1285
    },
    {
      "month": 11,
      "billedEnergyAmouth": 1143.83,
      "billedEnergyProduced": 281,
      "billedEnergy": 1476
    },
    {
      "month": 12,
      "billedEnergyAmouth": 1143.83,
      "billedEnergyProduced": 196,
      "billedEnergy": 130
    }
  ];
  private svg: any;
  private margin = { top: 50, right: 50, bottom: 50, left: 50 };
  private width = 0;
  private height = 0;
  private xScale: any;
  private yScale: any;
  private colorScale: any;
  private line: any;
  private area: any;

  ADD = NOTIFICATION_CONSTANTS.ADD_CONFIRM_TYPE;
  CANCEL = NOTIFICATION_CONSTANTS.CANCEL_TYPE;
  EDIT = NOTIFICATION_CONSTANTS.EDIT_CONFIRM_TYPE;
  DELETE = NOTIFICATION_CONSTANTS.DELETE_CONFIRM_TYPE;
  ERROR = NOTIFICATION_CONSTANTS.ERROR_TYPE;

  constructor(
    public dialog: MatDialog,
    private moduleService: FinantialService,
    private notificationDataService: NotificationDataService,
    private encryptionService: EncryptionService,
    private notificationsService: NotificationService,
    public notificationDialog: MatDialog,
    private translationService: TranslationService
  ) {

  }

  ngOnInit(): void {
    // Transformar los datos mensuales al formato para D3graph
    this.transformMonthlyData();
  }

  ngAfterViewInit() {
    // No es necesario inicializar el contenedor de gráfica aquí
    // ya que estamos usando el componente D3graph
  }
  
  /**
   * Transforma los datos mensuales al formato que espera el componente D3graph
   */
  transformMonthlyData(): void {
    // Limpiar datos existentes
    this.financialData = [];
    
    const currentYear = new Date().getFullYear();
    
    // Para cada entrada mensual
    this.monthlyData.forEach(monthData => {
      // Crear fecha para el mes (usando el año actual)
      const date = new Date(currentYear, monthData.month - 1, 15); // Día 15 del mes
      
      // Añadir billedEnergyAmouth como línea
      this.financialData.push({
        date: new Date(date),
        value: monthData.billedEnergyAmouth,
        category: 'Monto de Energía Facturada',
        type: 'line' // Marcar como línea
      });
      
      // Añadir billedEnergyProduced como barra
      this.financialData.push({
        date: new Date(date),
        value: monthData.billedEnergyProduced,
        category: 'Energía Producida',
        type: 'bar' // Marcar como barra
      });
      
      // Añadir billedEnergy como barra
      this.financialData.push({
        date: new Date(date),
        value: monthData.billedEnergy,
        category: 'Energía Facturada',
        type: 'bar' // Marcar como barra
      });
    });
  }

  // Métodos existentes
  openFileSelector() {
    this.fileInput.nativeElement.value = '';
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event) {
    this.selectedFile = null;
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
    if (this.selectedFile != null) {
      this.openValidation()
    }
    input.value = '';
  }

  openValidation() {
    let dataModal: FinantialDataModelStepper = { file: this.selectedFile };
    this.scenarios = null;
    this.processStatus = null;
    this.fileId = null;
    const dialogRef = this.dialog.open(FinantialStepperComponent, {
      disableClose: true,
      width: '753px',
      data: dataModal!
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result.status) {
        this.processStatus = result.status
      }
      if (result.scenarios) {
        this.scenarios = result.scenarios
      }
      if (result.fileId) {
        this.fileId = result.fileId
      }
      this.selectedFile = null;
    });
  }

  donwloadTemplate() {
    this.moduleService.downloadTemplate().subscribe({
      next: (resp: Blob) => {
        const url = window.URL.createObjectURL(resp);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'FinantialModelTemplate.csv';
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      },
      error: (err) => {
      }
    })
  }

  getInformation() {
    let snackMessagesAdd: NotificationMessages = {
      completedTitleSnack: NOTIFICATION_CONSTANTS.CONFIRM_DOWNLOAD_FILE_TITLE,
      completedContentSnack: NOTIFICATION_CONSTANTS.CONFIRM_DOWNLOAD_FILE_CONTENT,
    }
    this.moduleService.exportInformation(this.fileId!, snackMessagesAdd).subscribe({
      next: (excel: Blob) => {
        const url = window.URL.createObjectURL(excel);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'FinantialModel.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      },
      error: (err) => {
      }
    })
  }

  deleteScenarios(notificationData: NotificationMessages) {
    this.moduleService.deleteFile(this.fileId!, notificationData).subscribe({
      next: (resp: any) => {
        this.selectedFile = null;
        this.scenarios = null;
        this.processStatus = null;
        this.fileId = null;
      },
      error: (err) => {
      }
    })
  }

  createNotificationModal(notificationType: string) {
    const encryptedData = localStorage.getItem('userInfo');
    if (encryptedData) {
      const userInfo = this.encryptionService.decryptData(encryptedData);
      const dataNotificationModal: notificationData | undefined = this.notificationDataService.finantialNotificationData(notificationType);
      const dataNotificationService: NotificationServiceData = {
        userId: userInfo.id,
        descripcion: dataNotificationModal?.title,
        notificationTypeId: dataNotificationModal?.typeId,
        notificationStatusId: this.notificationsService.getNotificationStatusByName(NOTIFICATION_CONSTANTS.INPROGRESS_STATUS).id
      }
      this.notificationsService.createNotification(dataNotificationService).subscribe(res => {
        this.notificationId = res.response.externalId;
      })

      const dialogRef = this.notificationDialog.open(NotificationComponent, {
        width: '540px',
        data: dataNotificationModal
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.confirmed && this.notificationId) {
          switch (result.action) {
            case this.DELETE:
              let snackMessagesAdd: NotificationMessages = {
                completedTitleSnack: NOTIFICATION_CONSTANTS.CONFIRM_DELETE_FINANTIAL_TITLE,
                completedContentSnack: NOTIFICATION_CONSTANTS.CONFIRM_DELETE_FINANTIAL_CONTENT,
                notificationId: this.notificationId,
                successCenterMessage: NOTIFICATION_CONSTANTS.DELETE_FINANTIAL_SUCCESS,
                errorCenterMessage: NOTIFICATION_CONSTANTS.DELETE_FINANTIAL_ERROR,
                userId: userInfo.id
              }
              this.deleteScenarios(snackMessagesAdd);
              return;
          }
        } else {
          if (this.notificationId) {
            const editStatusData: EditNotificationStatus = {
              externalId: this.notificationId,
              status: this.notificationsService.getNotificationStatusByName(NOTIFICATION_CONSTANTS.CANCELED_STATUS).id
            }
            this.notificationsService.updateNotification(editStatusData).subscribe(res => { })
          }
        }
      });
    }
  }

  // Nuevos métodos para D3.js
  
  /**
   * Inicializa el contenedor de la gráfica
   */
  private initChartContainer(): void {
    if (!this.chartContainer) return;
    
    const element = this.chartContainer.nativeElement;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
    
    // Inicializar escalas de colores
    this.colorScale = d3.scaleOrdinal(d3.schemeRdYlGn[8]);
  }
  
  /**
   * Genera datos financieros aleatorios o carga los datos mensuales
   */
  generateData(): void {
    // Alternar entre datos aleatorios y datos mensuales
    if (this.chartType === 'bar-line') {
      // Si estamos en modo bar-line, volver a cargar los datos mensuales
      this.transformMonthlyData();
    } else {
      // Limpiar datos existentes
      this.financialData = [];
      
      // Categorías financieras
      const categories = ['Ingresos', 'Gastos', 'Inversiones', 'Ahorros', 'Préstamos'];
      
      // Generar datos para los últimos 5 años por mes (60 puntos de datos por categoría)
      const endDate = new Date();
      const startDate = new Date(endDate);
      startDate.setFullYear(endDate.getFullYear() - 5);
      
      // Para cada categoría
      categories.forEach(category => {
        let baseValue = Math.random() * 10000 + 5000; // Valor base entre 5000 y 15000
        let volatility = Math.random() * 0.3 + 0.1; // Volatilidad entre 0.1 y 0.4
        
        // Generar un punto de datos para cada mes
        for (let d = new Date(startDate); d <= endDate; d.setMonth(d.getMonth() + 1)) {
          // Añadir algo de aleatoriedad al valor
          const randomFactor = 1 + (Math.random() * 2 - 1) * volatility;
          baseValue = baseValue * randomFactor;
          
          // Añadir tendencia estacional (más alto en diciembre, más bajo en enero)
          const month = d.getMonth();
          let seasonalFactor = 1;
          if (month === 11) seasonalFactor = 1.2; // Diciembre
          if (month === 0) seasonalFactor = 0.8; // Enero
          
          const value = baseValue * seasonalFactor;
          
          this.financialData.push({
            date: new Date(d),
            value: value,
            category: category
          });
        }
      });
    }
  }
  
  /**
   * Limpia la gráfica y vuelve a cargar los datos mensuales si es necesario
   */
  clearChart(): void {
    this.financialData = [];
    
    // Si estamos en modo bar-line, volver a cargar los datos mensuales después de un breve retraso
    if (this.chartType === 'bar-line') {
      setTimeout(() => {
        this.transformMonthlyData();
      }, 500);
    }
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    
    // Limpiar tooltip si existe
    d3.select('.d3-tooltip').remove();
  }
}
