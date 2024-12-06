import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import * as entity from '../../plants-model';
import { Observable, Subject, Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import Highcharts from 'highcharts';
import { PlantsService } from '../../plants.service';
import { Store } from '@ngrx/store';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import { ActivatedRoute } from '@angular/router';
import { DataResponseArraysMapper, FilterState } from '@app/shared/models/general-models';
import { selectDrawer } from '@app/core/store/selectors/drawer.selector';
import { GeneralFilters } from '@app/pages/homeMain/home/home-model';
import { EncryptionService } from '@app/shared/services/encryption.service';

@Component({
  selector: 'app-savings',
  templateUrl: './savings.component.html',
  styleUrl: './savings.component.scss'
})
export class SavingsComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();
  @Input() plantData: entity.DataPlant | any;
  @Input() notData!: boolean;

  generalFilters$!: Observable<FilterState['generalFilters']>;

  showAlert: boolean = false;
  Highcharts: typeof Highcharts = Highcharts;
  dots = Array(3).fill(0);

  savingDetails: DataResponseArraysMapper = {
    primaryElements: [],
    additionalItems: []
  };

  constructor(
    private moduleServices: PlantsService,
    private notificationService: OpenModalsService,
    private store: Store<{ filters: FilterState }>,
    private encryptionService: EncryptionService,
  ) {
    this.generalFilters$ = this.store.select(state => state.filters.generalFilters);
  }

  ngOnInit(): void {
    if (this.notData) this.showAlert = true;
    else this.getUserClient()
  }

  getUserClient() {
    const encryptedData = localStorage.getItem('userInfo');
    if (encryptedData) {
      const userInfo = this.encryptionService.decryptData(encryptedData);

      this.generalFilters$.subscribe((generalFilters: GeneralFilters) => {
        this.getSavings({clientId : userInfo.clientes[0], ...generalFilters});
      });
    }
  }

  getSavings(filters:GeneralFilters) {
    this.moduleServices.getSavingsDetails(filters).subscribe({
      next: (response: entity.DataResponseArraysMapper) => {
        this.savingDetails = response;
      },
      error: (error) => {
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert')
        console.log(error);
      }
    })
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }
}
