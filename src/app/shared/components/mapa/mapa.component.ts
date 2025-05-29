import { AfterViewInit, Component, ComponentRef, ElementRef, Injector, Input, OnInit, ViewContainerRef } from '@angular/core';
import anime from 'animejs/lib/anime.es.js';
import { Store } from '@ngrx/store';
import { GeneralFilters, GeneralResponse, UserInfo } from '@app/shared/models/general-models';
import { Observable } from 'rxjs';
import tippy, { Instance } from 'tippy.js';
import { TooltipComponent } from '../tooltip/tooltip.component';
import * as entity from '../../../pages/homeMain/home/home-model';
import { HomeService } from '@app/pages/homeMain/home/home.service';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import { EncryptionService } from '@app/shared/services/encryption.service';

@Component({
    selector: 'app-mapa',
    templateUrl: './mapa.component.html',
    styleUrls: ['./mapa.component.scss'],
    standalone: false
})

export class MapaComponent implements AfterViewInit {
  @Input()   tooltipsInfo: entity.statesResumeTooltip[] = [];
  @Input() statesColors:any ={};
  private tippyInstance!: Instance | null;
  selectedStates: string[] = [];
  generalFilters$!: Observable<GeneralFilters>;
  userInfo!: UserInfo;



  constructor(
    private store: Store<{ filters: GeneralFilters }>,
    private el: ElementRef,
    private viewContainerRef: ViewContainerRef,
    private injector: Injector,
    private homeService: HomeService,
    private notificationService: OpenModalsService,
    private encryptionService: EncryptionService,

  ) {
    this.createTooltips();
    this.generalFilters$ = this.store.select(state => state.filters);
    this.generalFilters$.subscribe(filters => {
      //this.filters = filters;
      //this.getTooltipInfo(filters);
    });
  }

  ngAfterViewInit() {
    // Los tooltips se generan después de que se obtienen los datos
    this.createTooltips();

  }

  getTooltipInfo(filters?: any) {
    const encryptedData = localStorage.getItem('userInfo');
    if (encryptedData) {
      const userInfo = this.encryptionService.decryptData(encryptedData);
      this.homeService.getDataStates({ clientId: userInfo?.clientes[0], ...filters }).subscribe({
        next: (response: GeneralResponse<entity.MapStatesResponse>) => {
  
          response.response.kwhByStateResponse.forEach((state:any) => {
            var color:string; 
  
            color="#FFFFFF";
            if(state.totalInstalledCapacity>0 && state.totalInstalledCapacity <= 1500) color="#9AE3E1"
            else if(state.totalInstalledCapacity>1500 && state.totalInstalledCapacity <= 3000) color="#64E2E2"
            else if(state.totalInstalledCapacity>3000 && state.totalInstalledCapacity <= 4500) color="#00E5FF"
            else if(state.totalInstalledCapacity>4500 && state.totalInstalledCapacity <= 6000) color="#08C4DA"
            else if(state.totalInstalledCapacity>6000) color="#008796"
            this.statesColors[state.state] = {
              color: color,
            };
          });
  
          this.tooltipsInfo = response.response.kwhByStateResponse;
          this.createTooltips();
        },
        error: (error) => {
          this.notificationService.notificacion(`Talk to the administrator.`, 'alert');
        }
      });
    }
  }

  createTooltips() {
    const estados = this.el.nativeElement.querySelectorAll('path');
    console.log(estados)
    estados.forEach((estado: HTMLElement) => {
      const nombreEstado = estado.getAttribute('id');
      const dataEstado = this.tooltipsInfo.find(item => item.state.toLowerCase() === nombreEstado?.toLowerCase());
      console.log(nombreEstado)
      const tooltipContent = this.createComponent(TooltipComponent);
      tooltipContent.instance.title = nombreEstado || '';
      
      if (dataEstado) {
        tooltipContent.instance.infoAdicional = [
          { subtitle: 'Active plants', content: `${dataEstado.plants} plants` },
          { subtitle: 'Total Installed Capacity kWh', content: `${dataEstado.totalInstalledCapacity.toLocaleString()} kWh` },
          { subtitle: 'Total CO2 Saving', content: `${dataEstado.tco2Savings.toLocaleString()} tCO2` }
        ];
      } else {
        tooltipContent.instance.infoAdicional = [
          { subtitle: 'Active plants', content: '0 plants' },
          { subtitle: 'Total Installed Capacity kWh', content: '0 kWh' },
          { subtitle: 'Total CO2 Saving', content: `0 tCO2` }
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
 
  }

  createComponent(component: any): ComponentRef<any> {
    const componentRef = this.viewContainerRef.createComponent(component, { injector: this.injector });
    return componentRef;
  }
}
