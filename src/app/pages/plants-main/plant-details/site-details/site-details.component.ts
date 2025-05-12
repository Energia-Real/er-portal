import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DataResponseArraysMapper, GeneralFilters } from '@app/shared/models/general-models';
import { Observable, Subject, Subscription, takeUntil } from 'rxjs';
import * as entity from '../../plants-model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PlantsService } from '../../plants.service';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectDrawer } from '@app/core/store/selectors/drawer.selector';
import { environment } from '@environment/environment';
import { TranslationService } from '@app/shared/services/i18n/translation.service';


@Component({
    selector: 'app-site-details',
    templateUrl: './site-details.component.html',
    styleUrl: './site-details.component.scss',
    standalone: false
})
export class SiteDetailsComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();
  @Input() plantData!: entity.DataPlant;
  @Input() notData!: boolean;

  drawerOpenSub: Subscription;

  urlMap!: SafeResourceUrl;
  loaderMap: boolean = true;
  materialIcon: string = 'help_outline'

  siteDetails: DataResponseArraysMapper = {
    primaryElements: [],
    additionalItems: []
  };

  drawerOpen: boolean = false
  showAlert: boolean = false

  id: string = '';

  constructor(
    private sanitizer: DomSanitizer,
    private moduleServices: PlantsService,
    private notificationService: OpenModalsService,
    private route: ActivatedRoute,
    private store: Store<{ filters: GeneralFilters }>,
    private translationService: TranslationService
  ) {
    this.drawerOpenSub = this.store.select(selectDrawer).subscribe(resp => this.drawerOpen = resp.drawerOpen);
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id')!;

    if (this.notData) this.showAlert = true;
    else this.getSiteDetails();

    setTimeout(() => {
      this.loaderMap = false;
      this.urlMap = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.google.com/maps/embed/v1/view?key=${environment.GOOGLE_API_KEY}&center=` + this.plantData?.latitude + ',' + this.plantData?.longitude + '&zoom=18&maptype=satellite');
    }, 100);

    // Subscribe to language changes
    this.translationService.currentLang$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(() => {
        if (!this.notData) {
          this.getSiteDetails();
        }
      });
  }

  getSiteDetails() {
    this.moduleServices.getSiteDetails(this.id).subscribe({
      next: (response: DataResponseArraysMapper) => {
        this.siteDetails.primaryElements = response.primaryElements;
        this.siteDetails.additionalItems = response.additionalItems;
      },
      error: (error) => {
        this.showAlert = true;
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert');
        console.error(error)
      }
    })
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }
}
