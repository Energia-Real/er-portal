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
  statesColors:any ={};
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

        response.forEach((state) => {
          var color:string; 

          color="#FFFFFF";
          if(state.totalInstalledCapacity>0 && state.totalInstalledCapacity <= 1500) color="#9AE3E1"
          else if(state.totalInstalledCapacity>1500 && state.totalInstalledCapacity <= 3000) color="#64E2E2"
          else if(state.totalInstalledCapacity>3000 && state.totalInstalledCapacity <= 4500) color="#00E5FF"
          else if(state.totalInstalledCapacity>4500 && state.totalInstalledCapacity <= 6000) color="#08C4DA"
          else if(state.totalInstalledCapacity>6000) color="#008796"
          console.log(state)
          console.log(color)
          this.statesColors[state.estado] = {
            color: color,
          };
        });
        console.log(this.statesColors)

        this.tooltipsInfo = response;
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
          { subtitle: 'Total Installed Capacity kWh', content: `${dataEstado.totalInstalledCapacity.toLocaleString()} kWh` }
        ];
      } else {
        tooltipContent.instance.infoAdicional = [
          { subtitle: 'Active plants', content: '0 plants' },
          { subtitle: 'Total Installed Capacity kWh', content: '0 kWh' }
        ];
      }

      tippy(estado, {
        content: tooltipContent.location.nativeElement,
        allowHTML: true,
        placement: 'top',
        arrow: true,
        theme: 'custom',
        trigger: 'click',
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
