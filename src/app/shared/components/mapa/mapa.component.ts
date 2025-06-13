import { AfterViewInit, Component, ComponentRef, ElementRef, Injector, Input, OnDestroy, ViewContainerRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { GeneralFilters, GeneralResponse, UserInfo } from '@app/shared/models/general-models';
import { Observable, takeUntil, Subject, auditTime } from 'rxjs';
import tippy, { Instance } from 'tippy.js';
import { TooltipComponent } from '../tooltip/tooltip.component';
import * as entity from '../../../pages/homeMain/home/home-model';
import { HomeService } from '@app/pages/homeMain/home/home.service';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import { EncryptionService } from '@app/shared/services/encryption.service';
import { TranslationService } from '@app/shared/services/i18n/translation.service';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss'],
  standalone: false
})

export class MapaComponent implements AfterViewInit, OnDestroy {
  private onDestroy$ = new Subject<void>();

  @Input() tooltipsInfo: entity.statesResumeTooltip[] = [];
  @Input() statesColors: any = {};
  private tippyInstances: Instance[] = [];
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
    private translationService: TranslationService,
  ) {
    this.translationService.currentLang$
      .pipe(takeUntil(this.onDestroy$)).pipe(auditTime(500))
      .subscribe(() => this.createTooltips());
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

          response.response.kwhByStateResponse.forEach((state: any) => {
            var color: string;

            color = "#FFFFFF";
            if (state.totalInstalledCapacity > 0 && state.totalInstalledCapacity <= 1500) color = "#9AE3E1"
            else if (state.totalInstalledCapacity > 1500 && state.totalInstalledCapacity <= 3000) color = "#64E2E2"
            else if (state.totalInstalledCapacity > 3000 && state.totalInstalledCapacity <= 4500) color = "#00E5FF"
            else if (state.totalInstalledCapacity > 4500 && state.totalInstalledCapacity <= 6000) color = "#08C4DA"
            else if (state.totalInstalledCapacity > 6000) color = "#008796"
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
    // Destroy existing tooltips
    this.destroyTooltips();

    const estados = this.el.nativeElement.querySelectorAll('path');
    console.log(estados)
    console.log(this.tooltipsInfo)
    estados.forEach((estado: HTMLElement) => {
      const nombreEstado = estado.getAttribute('id');
      const dataEstado = this.tooltipsInfo.find(item => item.state.toLowerCase() === nombreEstado?.toLowerCase());
      const tooltipContent = this.createComponent(TooltipComponent);
      tooltipContent.instance.title = nombreEstado || '';

      if (dataEstado && dataEstado.plants && dataEstado.tco2Savings) {
        tooltipContent.instance.infoAdicional = [
          { subtitle: this.translationService.instant('MAPA.TOOLTIPS.ACTIVE'), content: `${dataEstado.plants} ${this.translationService.instant('MAPA.TOOLTIPS.PLANTS')}` },
          { subtitle: this.translationService.instant('MAPA.TOOLTIPS.TOTAL_CAPACITY'), content: `${dataEstado.totalInstalledCapacity.toLocaleString()} kWh` },
          { subtitle: this.translationService.instant('MAPA.TOOLTIPS.TOTAL_CO2'), content: `${dataEstado.tco2Savings.toLocaleString()} tCO2` }
        ];
      } else {
        tooltipContent.instance.infoAdicional = [
          { subtitle: this.translationService.instant('MAPA.TOOLTIPS.ACTIVE'), content: `0 ${this.translationService.instant('MAPA.TOOLTIPS.PLANTS')}` },
          { subtitle: this.translationService.instant('MAPA.TOOLTIPS.TOTAL_CAPACITY'), content: '0 kWh' },
          { subtitle: this.translationService.instant('MAPA.TOOLTIPS.TOTAL_CO2'), content: '0 tCO2' }
        ];
      }

      const instance = tippy(estado, {
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

      // Store the tippy instance for later destruction
      this.tippyInstances.push({ ...instance });
      
    });
  }

  destroyTooltips() {
    // Destroy all tippy instances
    this.tippyInstances.forEach(instance => {
      instance.destroy();
    });
    this.tippyInstances = [];
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

  ngOnDestroy(): void {
    this.destroyTooltips();
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
