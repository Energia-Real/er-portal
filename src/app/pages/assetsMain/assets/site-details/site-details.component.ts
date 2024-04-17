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

  @Input() assetData: any;
  urlMap!: SafeResourceUrl;
  loaderMap: boolean = true;

  constructor(
    private sanitizer: DomSanitizer,
    private assetsService : AssetsService,
    private notificationService: OpenModalsService
  ){
  }

  ngOnInit() {
    // 'ERROR : 
    // Access to XMLHttpRequest at 'https://er-transformer-proxy-int.azurewebsites.net/api/v1/integrators/proxy/getSiteDetailsByPlant' from origin 'http://localhost:9000' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
    // '
    
    // this.getDataResponseDetails();
    setTimeout(()=>{
      this.urlMap = this.sanitizer.bypassSecurityTrustResourceUrl('https://www.google.com/maps/embed/v1/view?key=AIzaSyAm6X3YpXfXqYdRANKV4AADLZPkedrwG2k&center=' + this.assetData.latitude + ',' + this.assetData.longitude + '&zoom=18&maptype=satellite');
      this.loaderMap = false;
    }, 100)
  }

  getDataResponseDetails() {
    let objData :entity.PostDataByPlant = {
      brand : 'huawei',
      plantCode : 'NE=33779163'
    };

    this.assetsService.getDataResponseDetails(objData).subscribe({
      next: ( response : entity.DataResponseDetails ) => {
        console.log('getDataResponseDetails', response);
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
