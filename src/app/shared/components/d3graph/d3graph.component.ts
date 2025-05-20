import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { debounceTime, fromEvent, Subject, takeUntil } from 'rxjs';

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

// Interfaz para datos mensuales
interface MonthlyData {
  month: number;
  [key: string]: number;
}

@Component({
  selector: 'app-d3graph',
  standalone: false,
  templateUrl: './d3graph.component.html',
  styleUrl: './d3graph.component.scss'
})
export class D3graphComponent implements OnChanges, AfterViewInit{
  @ViewChild('chartContainer') chartContainer!: ElementRef;
  private onDestroy$ = new Subject<void>();


  @Input() data: FinancialDataPoint[]=[]
  @Input() title:string = ' ';
  @Input() chartType: 'bar'| 'line'| 'area'| 'bar-line'= 'bar'


  // Propiedades para D3.js
  private svg: any;
  private margin = { top: 50, right: 50, bottom: 50, left: 50 };
  private width = 0;
  private height = 0;
  private xScale: any;
  private yScale: any;
  private colorScale: any;
  private line: any;
  private area: any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] || changes['chartType']) {
      if(this.data.length==0){
        d3.select(this.chartContainer.nativeElement).selectAll('*').remove();
      }
      this.updateChart()
      console.log(this.data)
    }
    
   
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

  private initChartContainer(): void {
    if (!this.chartContainer) return;

    const element = this.chartContainer.nativeElement;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;

    // Inicializar escalas de colores
    this.colorScale = d3.scaleOrdinal(d3.schemeRdYlGn[8]);
  }

  updateChart(): void {
    if (!this.chartContainer || this.data.length === 0) return;
    
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
    const nestedData = d3.group(this.data, d => d.category);
    
    // Configurar escalas
    this.xScale = d3.scaleTime()
      .domain(d3.extent(this.data, d => d.date) as [Date, Date])
      .range([0, this.width]);
    
    this.yScale = d3.scaleLinear()
      .domain([0, d3.max(this.data, d => d.value) as number * 1.1]) // 10% más alto para margen
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
      .text(this.title);
    
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
      case 'bar-line':
        this.renderBarLineChart(nestedData, tooltip);
        break;
      case 'line':
      default:
        this.renderLineChart(nestedData, tooltip);
        break;
    }
    
    // Añadir leyenda
    this.addLegend(Array.from(nestedData.keys()));
  }

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
   * Renderiza un gráfico combinado de barras y líneas
   */
  private renderBarLineChart(nestedData: Map<string, FinancialDataPoint[]>, tooltip: any): void {
    // Separar categorías para barras y líneas
    const lineCategories: string[] = [];
    const barCategories: string[] = [];
    
    nestedData.forEach((values, category) => {
      // Verificar si hay algún punto con tipo definido
      const hasTypeSpecified = values.some(d => d.type !== undefined);
      
      if (hasTypeSpecified) {
        // Si hay tipos especificados, usar esos
        const isLine = values[0].type === 'line';
        if (isLine) {
          lineCategories.push(category);
        } else {
          barCategories.push(category);
        }
      } else {
        // Por defecto, la primera categoría es línea, el resto barras
        if (category === Array.from(nestedData.keys())[0]) {
          lineCategories.push(category);
        } else {
          barCategories.push(category);
        }
      }
    });
    
    // Convertir los datos a un formato más fácil de usar para las barras
    const barData: {
      date: Date;
      month: string;
      category: string;
      value: number;
    }[] = [];
    
    // Procesar los datos para barras
    barCategories.forEach(category => {
      const values = nestedData.get(category) || [];
      values.forEach(dataPoint => {
        const date = new Date(dataPoint.date);
        // Usar el mes como agrupador
        const monthDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        barData.push({
          date: monthDate,
          month: monthKey,
          category: category,
          value: dataPoint.value
        });
      });
    });
    
    // Agrupar por mes y categoría para calcular promedios
    const aggregatedData: {
      date: Date;
      month: string;
      category: string;
      value: number;
    }[] = [];
    
    // Usar un Map para agrupar
    const groupedData = new Map<string, Map<string, number[]>>();
    
    barData.forEach(item => {
      if (!groupedData.has(item.month)) {
        groupedData.set(item.month, new Map<string, number[]>());
      }
      
      const monthMap = groupedData.get(item.month)!;
      
      if (!monthMap.has(item.category)) {
        monthMap.set(item.category, []);
      }
      
      monthMap.get(item.category)!.push(item.value);
    });
    
    // Calcular promedios para barras
    groupedData.forEach((categoryMap, month) => {
      const date = barData.find(d => d.month === month)?.date || new Date();
      
      categoryMap.forEach((values, category) => {
        const avgValue = values.reduce((sum, val) => sum + val, 0) / values.length;
        
        aggregatedData.push({
          date: date,
          month: month,
          category: category,
          value: avgValue
        });
      });
    });
    
    // Ordenar por fecha
    aggregatedData.sort((a, b) => a.date.getTime() - b.date.getTime());
    
    // Obtener meses únicos ordenados
    const months = Array.from(new Set(aggregatedData.map(d => d.month))).sort();
    
    // Limitar a los últimos 12 meses si hay demasiados
    const limitedMonths = months.length > 12 ? months.slice(-12) : months;
    
    // Filtrar datos para mostrar solo los meses limitados
    const limitedData = aggregatedData.filter(d => limitedMonths.includes(d.month));
    
    // Crear escalas para las barras agrupadas
    const xScale0 = d3.scaleBand()
      .domain(limitedMonths)
      .range([0, this.width])
      .padding(0.2);
    
    const xScale1 = d3.scaleBand()
      .domain(barCategories)
      .range([0, xScale0.bandwidth()])
      .padding(0.1);
    
    // Actualizar eje X con formato de fecha para meses
    this.svg.select('.x-axis')
      .call(d3.axisBottom(xScale0)
        .tickFormat((d: any) => {
          const [year, month] = d.split('-');
          return d3.timeFormat('%b %Y')(new Date(parseInt(year), parseInt(month) - 1, 1));
        }));
    
    // Dibujar las barras
    limitedData.forEach(d => {
      this.svg.append('rect')
        .attr('class', `bar ${d.category.replace(/\s+/g, '-')}`)
        .attr('x', xScale0(d.month)! + xScale1(d.category)!)
        .attr('y', this.yScale(d.value))
        .attr('width', xScale1.bandwidth())
        .attr('height', this.height - this.yScale(d.value))
        .attr('fill', this.colorScale(d.category))
        .attr('stroke', '#fff')
        .attr('stroke-width', 0.5)
        .on('mouseover', (event: any) => {
          tooltip.transition()
            .duration(200)
            .style('opacity', .9);
          tooltip.html(`
            <strong>${d.category}</strong><br/>
            Fecha: ${d3.timeFormat('%b %Y')(d.date)}<br/>
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
    
    // Dibujar líneas para las categorías de línea
    lineCategories.forEach(category => {
      const values = nestedData.get(category) || [];
      
      // Ordenar datos por fecha
      values.sort((a, b) => a.date.getTime() - b.date.getTime());
      
      // Añadir línea
      const path = this.svg.append('path')
        .datum(values)
        .attr('fill', 'none')
        .attr('stroke', this.colorScale(category))
        .attr('stroke-width', 3) // Línea más gruesa para destacar
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
      this.svg.selectAll(`.dot-${category.replace(/\s+/g, '-')}`)
        .data(values)
        .enter()
        .append('circle')
        .attr('class', `dot-${category.replace(/\s+/g, '-')}`)
        .attr('cx', (d: FinancialDataPoint) => this.xScale(d.date))
        .attr('cy', (d: FinancialDataPoint) => this.yScale(d.value))
        .attr('r', 5) // Puntos más grandes para destacar
        .attr('fill', this.colorScale(category))
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
            .attr('r', 7);
        })
        .on('mouseout', (event: any) => {
          tooltip.transition()
            .duration(500)
            .style('opacity', 0);
          
          d3.select(event.currentTarget)
            .transition()
            .duration(200)
            .attr('r', 5);
        });
    });
    
    // Añadir título para el eje X
    this.svg.append('text')
      .attr('class', 'x-axis-label')
      .attr('text-anchor', 'middle')
      .attr('x', this.width / 2)
      .attr('y', this.height + 40)
      .text('Mes');
  }

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
    
    
  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
    
    // Limpiar tooltip si existe
    d3.select('.d3-tooltip').remove();
  }

}
