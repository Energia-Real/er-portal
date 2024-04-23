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

  @Input() assetData!: entity.DataDetailAsset;

  urlMap!: SafeResourceUrl;
  loaderMap: boolean = true;

  public siteResponse : any = { title : '', value: '' }


  constructor(
    private sanitizer: DomSanitizer,
    private assetsService : AssetsService,
    private notificationService: OpenModalsService
  ){
  }

  ngOnInit() {
    this.getDataResponse();
    setTimeout(()=>{
      this.urlMap = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.google.com/maps/embed/v1/view?key=AIzaSyAm6X3YpXfXqYdRANKV4AADLZPkedrwG2k&center=' + this.assetData.latitude + ',' + this.assetData.longitude + '&zoom=18&maptype=satellite');
      this.loaderMap = false;
    }, 100)
  }

  getDataResponse() {
    let objData :entity.PostDataByPlant = {
      brand : this.assetData.inverterBrand[0],
      plantCode : this.assetData.plantCode
    };

    this.assetsService.getDataRespSite(objData).subscribe({
      next: ( response : entity.DataResponseDetails ) => {
        console.log('getDataResponse', response);
        this.siteResponse = response.data;
      },
      error: (error) => {
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert')
        console.error(error)
      }
    })
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
