import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { AssetsService } from '../assets.service';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import * as entity from '../assets-model';

@Component({
  selector: 'app-site-details',
  templateUrl: './site-details.component.html',
  styleUrl: './site-details.component.scss'
})
export class SiteDetailsComponent implements OnInit, OnDestroy {
  private onDestroy = new Subject<void>();

  @Input() assetData!: entity.DataPlant;
  @Input() notData! : boolean;

  urlMap!: SafeResourceUrl;
  loaderMap: boolean = true;
  materialIcon:string = 'help_outline'

  siteResponse: any = []
  showAlert: boolean = false

  constructor(
    private sanitizer: DomSanitizer,
    private moduleServices: AssetsService,
    private notificationService: OpenModalsService
  ) { }

  ngOnInit() {
    if (this.notData) this.showAlert = true;
     else this.getDataResponse();
    
    setTimeout(() => {
      this.loaderMap = false;
      this.urlMap = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.google.com/maps/embed/v1/view?key=AIzaSyAm6X3YpXfXqYdRANKV4AADLZPkedrwG2k&center=' + this.assetData?.latitude + ',' + this.assetData?.longitude + '&zoom=18&maptype=satellite');
    }, 100)
  }

  getDataResponse() {
    let objData: entity.PostDataByPlant = {
      brand: this.assetData.inverterBrand[0],
      plantCode: this.assetData.plantCode
    };

    this.moduleServices.getDataRespSite(objData).subscribe({
      next: (response: entity.DataResponseDetailsMapper[]) => { this.siteResponse = response },
      error: (error) => {
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert');
        console.error(error)
      }
    })
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
