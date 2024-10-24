import { AfterViewInit, Component, ComponentRef, ElementRef, Injector, Input, OnInit, ViewContainerRef } from '@angular/core';
import anime from 'animejs/lib/anime.es.js';
import { setFilters } from '@app/core/store/actions/filters.actions';
import { Store } from '@ngrx/store';
import { FilterState } from '@app/shared/models/general-models';
import { Observable } from 'rxjs';
import tippy, { Instance } from 'tippy.js';
import { TooltipComponent } from '../tooltip/tooltip.component';
import * as entity from '../../../pages/homeMain/home/home-model';
import { HomeService } from '@app/pages/homeMain/home/home.service';
import { OpenModalsService } from '@app/shared/services/openModals.service';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements AfterViewInit {

  private tippyInstance!: Instance | null;
  tooltipsInfo: entity.statesResumeTooltip[] = [];

  selectedStates: string[] = [];
  filters$!: Observable<FilterState['filters']>;
  filters!: FilterState['filters'];

  constructor(
    private store: Store<{ filters: FilterState }>,
    private el: ElementRef,
    private viewContainerRef: ViewContainerRef,
    private injector: Injector,
    private homeService: HomeService,
    private notificationService: OpenModalsService,
  ) {
    this.filters$ = this.store.select(state => state.filters.filters);
    this.filters$.subscribe(filters => {
      this.filters = filters;
      this.getTooltipInfo(filters);
    });
  }

  ngAfterViewInit() {
    // Los tooltips se generan después de que se obtienen los datos
  }

  getTooltipInfo(filters?: any) {
    this.homeService.getDataStates(filters).subscribe({
      next: (response: entity.statesResumeTooltip[]) => {
        this.tooltipsInfo = response;
        // Crear los tooltips una vez que los datos han sido cargados
        this.createTooltips();
      },
      error: (error) => {
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert');
      }
    });
  }

  createTooltips() {
    const estados = this.el.nativeElement.querySelectorAll('path');

    estados.forEach((estado: HTMLElement) => {
      const nombreEstado = estado.getAttribute('id');
      const dataEstado = this.tooltipsInfo.find(item => item.estado.toLowerCase() === nombreEstado?.toLowerCase());

      const tooltipContent = this.createComponent(TooltipComponent);
      tooltipContent.instance.title = nombreEstado || '';
      
      if (dataEstado) {
        tooltipContent.instance.infoAdicional = [
          { subtitle: 'Active plants', content: `${dataEstado.plantas} plants` },
          { subtitle: 'Total kWh', content: `${dataEstado.totalEnergyProduction.toLocaleString()} kWh` }
        ];
      } else {
        tooltipContent.instance.infoAdicional = [
          { subtitle: 'Active plants', content: '0 plants' },
          { subtitle: 'Total kWh', content: '0 kWh' }
        ];
      }

      tippy(estado, {
        content: tooltipContent.location.nativeElement,
        allowHTML: true,
        placement: 'top',
        arrow: true,
        theme: 'custom',
        trigger: 'mouseenter',
        onShow(instance) {
          const tooltip = instance.popper;
          tooltip.classList.remove('hide'); 
          tooltip.classList.add('show'); 
        },
        onHide(instance) {
          const tooltip = instance.popper;
          tooltip.classList.remove('show'); 
          tooltip.classList.add('hide'); 
        }
  
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
      console.log(filters);
      this.store.dispatch(setFilters({ filters }));

    } else {
      this.selectedStates.splice(index, 1);
      let filters = {
        ...this.filters,
        states: [...this.selectedStates]
      };
      console.log(filters);
      this.store.dispatch(setFilters({ filters }));
    }
  }

  createComponent(component: any): ComponentRef<any> {
    const componentRef = this.viewContainerRef.createComponent(component, { injector: this.injector });
    return componentRef;
  }
}
