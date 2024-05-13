import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AssetsService } from '../assets.service';
import { Subject } from 'rxjs';
import { CustomValidators } from '@app/shared/validators/custom-validatos';
import { CatalogsService } from '@app/shared/services/catalogs.service';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import moment from 'moment';
import * as entityCatalogs from '../../../../shared/models/catalogs-models';
import * as entity from '../assets-model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent implements OnDestroy {
  private onDestroy = new Subject<void>();

  formData = this.fb.group({
    siteName: ['', Validators.required],
    plantCode: ['', Validators.required],
    direction: ['', Validators.required],
    link: ['', [Validators.required, CustomValidators.validateUrlPrefix]],
    contractTypeId: ['', Validators.required],
    latitude: ['', [Validators.required, CustomValidators.validateLatitude]],
    longitude: ['', [Validators.required, CustomValidators.validateLongitude]],
    installationTypeId: ['', [Validators.required]],
    commissionDate: ['', [Validators.required]],
    installedCapacity: ['', [Validators.required]],
    contractSignatureDate: ['', [Validators.required]],
    endInstallationDate: ['', [Validators.required]],
    systemSize: ['', [Validators.required]],
    inverterQty: ['', [Validators.required]],
  });

  catContractType:entityCatalogs.DataCatalogs[] = [];
  catInstallationType:entityCatalogs.DataCatalogs[] = [];

  assetId: string | null = '';
  showLoader: boolean = false;
  loading: boolean = false;
  buttonDisabled: boolean = false;
  errorCreate: boolean = false;

  objEditData:any;
  constructor(
    private catalogsService: CatalogsService, 
    private notificationService: OpenModalsService,
    private fb: FormBuilder,
    private assetsService: AssetsService,
    private router: Router
  ) { }
  
  ngOnInit(): void {
    this.getCatalogs()
  }

  getCatalogs() {
    this.catalogsService.getCatContractType().subscribe({
      next: ( response : entityCatalogs.DataCatalogs[] ) => {
      this.catContractType = response;
      },
      error: (error) => {
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert')
        console.error(error)
      }
    });

    this.catalogsService.getCatInstallationType().subscribe({
      next: ( response : entityCatalogs.DataCatalogs[] ) => {
      this.catInstallationType = response;
      },
      error: (error) => {
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert')
        console.error(error)
      }
    });
  
    this.catalogsService.getCatInstallationType().subscribe({
      next: ( response : entityCatalogs.DataCatalogs[] ) => {
      this.catInstallationType = response;
      },
      error: (error) => {
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert')
        console.error(error)
      }
    });
  }

    
  actionSave() {
    const objData:any = {
      ...this.formData.value,
      commissionDate : moment(this.formData.get('commissionDate')?.value).format('YYYY-MM-DD'),
      endInstallationDate : moment(this.formData.get('endInstallationDate')?.value).format('YYYY-MM-DD'),
      contractSignatureDate : moment(this.formData.get('contractSignatureDate')?.value).format('YYYY-MM-DD'),
    }
    
    console.log('OBJETO :', objData);
    
    if (this.objEditData) this.saveDataPatch(objData);
    else this.saveDataPost(objData);
  }

  saveDataPost(objData:entity.DataSummaryProjects) {
    // this.assetsService.postCreateAsset(objData).subscribe({
    //   next: () => {
    //     this.completionMessage()
    //   },
    //   error: (error) => {
    //     this.notificationService.notificacion('Error', `Hable con el administrador.`, '', 'mat_outline:error')
    //     console.error(error)
    //   }
    // })
  }
  
  saveDataPatch(objData:entity.DataSummaryProjects) {
    // this.assetsService.patchDataRol(this.objEditData.id, objData).subscribe({
    //   next: () => {
    //     this.completionMessage(true)
    //   },
    //   error: (error) => {
    //     this.notificationService.notificacion('Error', `Hable con el administrador.`, '', 'mat_outline:error')
    //     console.error(error)
    //   }
    // })
  }
  
  clearForm() {
    this.formData.reset();
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
