import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { AssetsService } from '../assets.service';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import * as entity from '../assets-model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-site-details',
  templateUrl: './site-details.component.html',
  styleUrl: './site-details.component.scss'
})
export class SiteDetailsComponent implements OnInit, OnDestroy {
  private onDestroy = new Subject<void>();

  @Input() assetData!: entity.DataPlant;
  @Input() notData!: boolean;

  urlMap!: SafeResourceUrl;
  loaderMap: boolean = true;
  materialIcon: string = 'help_outline'

  siteResponse: any[] = []
  showAlert: boolean = false

  id: string = '';

  constructor(
    private sanitizer: DomSanitizer,
    private moduleServices: AssetsService,
    private notificationService: OpenModalsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('assetId')!;

    if (this.notData) this.showAlert = true;
    else this.getDataResponse();

    setTimeout(() => {
      this.loaderMap = false;
      this.urlMap = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.google.com/maps/embed/v1/view?key=AIzaSyAm6X3YpXfXqYdRANKV4AADLZPkedrwG2k&center=' + this.assetData?.latitude + ',' + this.assetData?.longitude + '&zoom=18&maptype=satellite');
    }, 100)
  }

  getDataResponseOverview() {
    this.moduleServices.getDataRespOverview(this.id).subscribe({
      next: (response: entity.DataResponseDetailsMapper[]) => {
        this.siteResponse.push(...response)
      },
      error: (error) => {
        this.showAlert = true;
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert');
        console.error(error)
      }
    })
  }

  getDataResponse() {
    let objData: entity.PostDataByPlant = {
      brand: "Huawei",
      plantCode: this.assetData.plantCode
    };

    this.moduleServices.getDataRespSite(objData).subscribe({
      next: (response: entity.DataResponseDetailsMapper[]) => {
        this.siteResponse = response;
        this.getDataResponseOverview();
      },
      error: (error) => {
        this.showAlert = true;
        this.notificationService.notificacion(`Talk to the administrator.`, 'alert');
        console.error(error)
      }
    })
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
