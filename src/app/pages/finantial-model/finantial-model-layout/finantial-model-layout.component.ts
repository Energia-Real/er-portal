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
  chartType: string = 'line';
  financialData: FinancialDataPoint[] = [];
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
    // Inicialización existente
  }

  ngAfterViewInit() {
    // Inicializar el contenedor de la gráfica después de que la vista se haya cargado
    setTimeout(() => {
      this.initChartContainer();
    }, 0);
    
    // Manejar el redimensionamiento de la ventana
    fromEvent(window, 'resize')
      .pipe(
        debounceTime(150),
        takeUntil(this.onDestroy$)
      )
      .subscribe(() => {
        this.updateChart();
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
   * Genera datos financieros aleatorios
   */
  generateData(): void {
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
    
    // Actualizar la gráfica con los nuevos datos
    this.updateChart();
  }
  
  /**
   * Actualiza o crea la gráfica basada en los datos actuales
   */
  updateChart(): void {
    if (!this.chartContainer || this.financialData.length === 0) return;
    
    // Limpiar SVG existente
    d3.select(this.chartContainer.nativeElement).selectAll('*').remove();
    
    // Recalcular dimensiones
    this.initChartContainer();
    
    // Crear SVG
    this.svg = d3.select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);
    
    // Agrupar datos por categoría
    const nestedData = d3.group(this.financialData, d => d.category);
    
    // Configurar escalas
    this.xScale = d3.scaleTime()
      .domain(d3.extent(this.financialData, d => d.date) as [Date, Date])
      .range([0, this.width]);
    
    this.yScale = d3.scaleLinear()
      .domain([0, d3.max(this.financialData, d => d.value) as number * 1.1]) // 10% más alto para margen
      .range([this.height, 0]);
    
    // Añadir ejes
    this.svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${this.height})`)
      .call(d3.axisBottom(this.xScale)
        .tickFormat((d: any) => d3.timeFormat('%b %Y')(d))
        .ticks(10));
    
    // Formato personalizado para el eje Y
    const formatMoney = (val: any) => `$${d3.format(',.0f')(val)}`;
    
    this.svg.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(this.yScale)
        .tickFormat(formatMoney as any));
    
    // Añadir título
    this.svg.append('text')
      .attr('x', this.width / 2)
      .attr('y', -20)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Visualización de Datos Financieros');
    
    // Definir generadores de línea y área
    this.line = d3.line<FinancialDataPoint>()
      .x(d => this.xScale(d.date))
      .y(d => this.yScale(d.value))
      .curve(d3.curveMonotoneX);
    
    this.area = d3.area<FinancialDataPoint>()
      .x(d => this.xScale(d.date))
      .y0(this.height)
      .y1(d => this.yScale(d.value))
      .curve(d3.curveMonotoneX);
    
    // Crear tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'd3-tooltip')
      .style('position', 'absolute')
      .style('background-color', 'rgba(0, 0, 0, 0.7)')
      .style('color', 'white')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('pointer-events', 'none')
      .style('opacity', 0);
    
    // Renderizar gráfica según el tipo seleccionado
    switch (this.chartType) {
      case 'bar':
        this.renderBarChart(nestedData, tooltip);
        break;
      case 'area':
        this.renderAreaChart(nestedData, tooltip);
        break;
      case 'line':
      default:
        this.renderLineChart(nestedData, tooltip);
        break;
    }
    
    // Añadir leyenda
    this.addLegend(Array.from(nestedData.keys()));
  }
  
  /**
   * Renderiza un gráfico de líneas
   */
  private renderLineChart(nestedData: Map<string, FinancialDataPoint[]>, tooltip: any): void {
    nestedData.forEach((values, key) => {
      // Ordenar datos por fecha
      values.sort((a, b) => a.date.getTime() - b.date.getTime());
      
      // Añadir línea
      const path = this.svg.append('path')
        .datum(values)
        .attr('fill', 'none')
        .attr('stroke', this.colorScale(key))
        .attr('stroke-width', 2)
        .attr('d', this.line);
      
      // Añadir animación a la línea
      const pathLength = path.node().getTotalLength();
      path
        .attr('stroke-dasharray', pathLength)
        .attr('stroke-dashoffset', pathLength)
        .transition()
        .duration(2000)
        .attr('stroke-dashoffset', 0);
      
      // Añadir puntos
      this.svg.selectAll(`.dot-${key.replace(/\s+/g, '-')}`)
        .data(values)
        .enter()
        .append('circle')
        .attr('class', `dot-${key.replace(/\s+/g, '-')}`)
        .attr('cx', (d: FinancialDataPoint) => this.xScale(d.date))
        .attr('cy', (d: FinancialDataPoint) => this.yScale(d.value))
        .attr('r', 4)
        .attr('fill', this.colorScale(key))
        .on('mouseover', (event: any, d: FinancialDataPoint) => {
          tooltip.transition()
            .duration(200)
            .style('opacity', .9);
          tooltip.html(`
            <strong>${key}</strong><br/>
            Fecha: ${d3.timeFormat('%d/%m/%Y')(d.date)}<br/>
            Valor: $${d3.format(',.2f')(d.value)}
          `)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 28) + 'px');
          
          d3.select(event.currentTarget)
            .transition()
            .duration(200)
            .attr('r', 6);
        })
        .on('mouseout', (event: any) => {
          tooltip.transition()
            .duration(500)
            .style('opacity', 0);
          
          d3.select(event.currentTarget)
            .transition()
            .duration(200)
            .attr('r', 4);
        });
    });
  }
  
  /**
   * Renderiza un gráfico de barras
   */
  private renderBarChart(nestedData: Map<string, FinancialDataPoint[]>, tooltip: any): void {
    // Implementación simplificada para gráficos de barras
    
    // Extraer categorías
    const categories = Array.from(nestedData.keys());
    
    // Convertir los datos a un formato más fácil de usar
    const barData: {
      date: Date;
      quarter: string;
      category: string;
      value: number;
    }[] = [];
    
    // Procesar los datos para agruparlos por trimestre en lugar de por mes
    nestedData.forEach((values, category) => {
      values.forEach(dataPoint => {
        const date = new Date(dataPoint.date);
        // Normalizar al primer día del trimestre para agrupar
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        const quarterDate = new Date(date.getFullYear(), (quarter - 1) * 3, 1);
        const quarterKey = `${quarterDate.getFullYear()}-Q${quarter}`;
        
        barData.push({
          date: quarterDate,
          quarter: quarterKey,
          category: category,
          value: dataPoint.value
        });
      });
    });
    
    // Agrupar por trimestre y categoría para calcular promedios
    const aggregatedData: {
      date: Date;
      quarter: string;
      category: string;
      value: number;
    }[] = [];
    
    // Usar un Map para agrupar
    const groupedData = new Map<string, Map<string, number[]>>();
    
    barData.forEach(item => {
      if (!groupedData.has(item.quarter)) {
        groupedData.set(item.quarter, new Map<string, number[]>());
      }
      
      const quarterMap = groupedData.get(item.quarter)!;
      
      if (!quarterMap.has(item.category)) {
        quarterMap.set(item.category, []);
      }
      
      quarterMap.get(item.category)!.push(item.value);
    });
    
    // Calcular promedios
    groupedData.forEach((categoryMap, quarter) => {
      const date = barData.find(d => d.quarter === quarter)?.date || new Date();
      
      categoryMap.forEach((values, category) => {
        const avgValue = values.reduce((sum, val) => sum + val, 0) / values.length;
        
        aggregatedData.push({
          date: date,
          quarter: quarter,
          category: category,
          value: avgValue
        });
      });
    });
    
    // Ordenar por fecha
    aggregatedData.sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // Obtener trimestres únicos ordenados
    const quarters = Array.from(new Set(aggregatedData.map(d => d.quarter))).sort();
    
    // Limitar a los últimos 8 trimestres si hay demasiados
    const limitedQuarters = quarters.length > 8 ? quarters.slice(-8) : quarters;
    
    // Filtrar datos para mostrar solo los trimestres limitados
    const limitedData = aggregatedData.filter(d => limitedQuarters.includes(d.quarter));
    
    // Crear escalas para las barras agrupadas con más espacio
    const xScale0 = d3.scaleBand()
      .domain(limitedQuarters)
      .range([0, this.width])
      .padding(0.2); // Aumentar el padding entre grupos
    
    const xScale1 = d3.scaleBand()
      .domain(categories)
      .range([0, xScale0.bandwidth()])
      .padding(0.1); // Aumentar el padding entre barras
    
    // Actualizar eje X con formato de fecha para trimestres
    this.svg.select('.x-axis')
      .call(d3.axisBottom(xScale0)
        .tickFormat((d: any) => {
          // Formato para trimestres: "Q1 2023", "Q2 2023", etc.
          return d;
        }));
    
    // Dibujar las barras con ancho mejorado
    limitedData.forEach(d => {
      this.svg.append('rect')
        .attr('class', `bar ${d.category.replace(/\s+/g, '-')}`)
        .attr('x', xScale0(d.quarter)! + xScale1(d.category)!)
        .attr('y', this.yScale(d.value))
        .attr('width', xScale1.bandwidth())
        .attr('height', this.height - this.yScale(d.value))
        .attr('fill', this.colorScale(d.category))
        .attr('stroke', '#fff') // Añadir borde para mejor visibilidad
        .attr('stroke-width', 0.5)
        .on('mouseover', (event: any) => {
          tooltip.transition()
            .duration(200)
            .style('opacity', .9);
          tooltip.html(`
            <strong>${d.category}</strong><br/>
            Periodo: ${d.quarter}<br/>
            Valor: $${d3.format(',.2f')(d.value)}
          `)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 28) + 'px');
          
          d3.select(event.currentTarget)
            .transition()
            .duration(200)
            .attr('opacity', 0.8)
            .attr('stroke-width', 1.5);
        })
        .on('mouseout', (event: any) => {
          tooltip.transition()
            .duration(500)
            .style('opacity', 0);
          
          d3.select(event.currentTarget)
            .transition()
            .duration(200)
            .attr('opacity', 1)
            .attr('stroke-width', 0.5);
        })
        // Añadir animación
        .attr('y', this.height)
        .attr('height', 0)
        .transition()
        .duration(800)
        .delay((_: any, i: number) => i * 50)
        .attr('y', this.yScale(d.value))
        .attr('height', this.height - this.yScale(d.value));
    });
    
    // Añadir título para el eje X
    this.svg.append('text')
      .attr('class', 'x-axis-label')
      .attr('text-anchor', 'middle')
      .attr('x', this.width / 2)
      .attr('y', this.height + 40)
      .text('Trimestre');
  }
  
  /**
   * Renderiza un gráfico de área
   */
  private renderAreaChart(nestedData: Map<string, FinancialDataPoint[]>, tooltip: any): void {
    // Ordenar categorías por valor promedio (de mayor a menor)
    const sortedCategories = Array.from(nestedData.entries())
      .map(([key, values]) => ({
        key,
        avgValue: d3.mean(values, (d: FinancialDataPoint) => d.value) || 0
      }))
      .sort((a, b) => b.avgValue - a.avgValue)
      .map(item => item.key);
    
    // Para cada categoría, añadir un área
    sortedCategories.forEach(category => {
      const values = nestedData.get(category) || [];
      
      // Ordenar datos por fecha
      values.sort((a, b) => a.date.getTime() - b.date.getTime());
      
      // Añadir área
      const path = this.svg.append('path')
        .datum(values)
        .attr('fill', this.colorScale(category))
        .attr('fill-opacity', 0.6)
        .attr('stroke', this.colorScale(category))
        .attr('stroke-width', 1.5)
        .attr('d', this.area);
      
      // Añadir animación al área
      const areaGenerator = d3.area<FinancialDataPoint>()
        .x(d => this.xScale(d.date))
        .y0(this.height)
        .y1(this.height)
        .curve(d3.curveMonotoneX);
      
      path.attr('d', areaGenerator)
        .transition()
        .duration(2000)
        .attr('d', this.area);
      
      // Añadir línea en la parte superior del área
      const linePath = this.svg.append('path')
        .datum(values)
        .attr('fill', 'none')
        .attr('stroke', this.colorScale(category))
        .attr('stroke-width', 2)
        .attr('d', this.line);
      
      // Añadir animación a la línea
      const pathLength = linePath.node().getTotalLength();
      linePath
        .attr('stroke-dasharray', pathLength)
        .attr('stroke-dashoffset', pathLength)
        .transition()
        .duration(2000)
        .attr('stroke-dashoffset', 0);
      
      // Añadir puntos interactivos
      this.svg.selectAll(`.dot-${category.replace(/\s+/g, '-')}`)
        .data(values)
        .enter()
        .append('circle')
        .attr('class', `dot-${category.replace(/\s+/g, '-')}`)
        .attr('cx', (d: FinancialDataPoint) => this.xScale(d.date))
        .attr('cy', (d: FinancialDataPoint) => this.yScale(d.value))
        .attr('r', 4)
        .attr('fill', this.colorScale(category))
        .attr('opacity', 0) // Inicialmente invisible
        .on('mouseover', (event: any, d: FinancialDataPoint) => {
          tooltip.transition()
            .duration(200)
            .style('opacity', .9);
          tooltip.html(`
            <strong>${category}</strong><br/>
            Fecha: ${d3.timeFormat('%d/%m/%Y')(d.date)}<br/>
            Valor: $${d3.format(',.2f')(d.value)}
          `)
            .style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 28) + 'px');
          
          d3.select(event.currentTarget)
            .transition()
            .duration(200)
            .attr('r', 6)
            .attr('opacity', 1);
        })
        .on('mouseout', (event: any) => {
          tooltip.transition()
            .duration(500)
            .style('opacity', 0);
          
          d3.select(event.currentTarget)
            .transition()
            .duration(200)
            .attr('r', 4)
            .attr('opacity', 0);
        });
    });
  }
  
  /**
   * Añade una leyenda al gráfico
   */
  private addLegend(categories: string[]): void {
    const legend = this.svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${this.width - 150}, 0)`);
    
    categories.forEach((category, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 20})`);
      
      legendRow.append('rect')
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', this.colorScale(category));
      
      legendRow.append('text')
        .attr('x', 15)
        .attr('y', 10)
        .text(category)
        .style('font-size', '12px');
    });
  }
  
  /**
   * Limpia la gráfica
   */
  clearChart(): void {
    this.financialData = [];
    d3.select(this.chartContainer.nativeElement).selectAll('*').remove();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    
    // Limpiar tooltip si existe
    d3.select('.d3-tooltip').remove();
  }
}
