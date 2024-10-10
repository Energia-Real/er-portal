import { AfterViewInit, Component, ComponentRef, ElementRef, Injector, OnInit,  ViewContainerRef } from '@angular/core';
import * as L from 'leaflet';
import geojson from '../../../../assets/geojsons/mexicoHigh.json'; // Ajusta la ruta a tu archivo GeoJSON
import { GeoJsonObject } from 'geojson';
import { setFilters, setFiltersBatu, setFiltersSolarCoverage } from '@app/core/store/actions/filters.actions';
import { Store } from '@ngrx/store';
import { FilterState } from '@app/shared/models/general-models';
import { Observable } from 'rxjs';
import tippy, { Instance } from 'tippy.js';
import { TooltipComponent } from '../tooltip/tooltip.component';
import 'tippy.js/animations/scale.css';


@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements AfterViewInit {

  private tippyInstance!: Instance | null;
  

  selectedStates: string[] = [];
  filters$!: Observable<FilterState['filters']>;
  filters!: FilterState['filters'];
  

  constructor(
    private store: Store<{ filters: FilterState }>,
    private el: ElementRef,
    private viewContainerRef: ViewContainerRef,
    private injector: Injector
  ){
    this.filters$ = this.store.select(state => state.filters.filters);
    this.filters$.subscribe(filters => {this.filters=filters });
  }

  ngAfterViewInit() {
    const estados = this.el.nativeElement.querySelectorAll('path');

    estados.forEach((estado: HTMLElement) => {
      const nombreEstado = estado.getAttribute('id');

      const tooltipContent = this.createComponent(TooltipComponent);
      tooltipContent.instance.title = nombreEstado || '';
      tooltipContent.instance.infoAdicional =[
        { subtitle: 'Active plants', content: 'x plants '  },
        { subtitle: 'Total kWh', content: '0,000,000 kWh' }
      ]
      tippy(estado, {
        content: tooltipContent.location.nativeElement,
        allowHTML: true,
        placement: 'top',
        arrow: true,
        theme: 'custom',
        trigger: 'mouseenter',
        animation: 'scale'

      });
    });
  }

  isSelected(stateId: string): boolean {
    return this.selectedStates.includes(stateId);
  }

  onPolygonClick(stateId: string): void {
    const index = this.selectedStates.indexOf(stateId);
    if (index === -1) {
      this.selectedStates.push(stateId);
      let filters = { 
        ...this.filters, 
        states: [...this.selectedStates] 
      };
      console.log(filters)
      this.store.dispatch(setFilters({ filters }));

    } else {
      this.selectedStates.splice(index, 1);
      let filters = { 
        ...this.filters, 
        states: [...this.selectedStates] 
      };
      console.log(filters)
      this.store.dispatch(setFilters({ filters }));    }
  }

  createComponent(component: any): ComponentRef<any> {
    const componentRef = this.viewContainerRef.createComponent(component, { injector: this.injector });
    return componentRef;
  }
}
