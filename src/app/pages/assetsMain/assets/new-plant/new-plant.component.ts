import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetsService } from '../assets.service';
import { Subject, takeUntil } from 'rxjs';
import { CustomValidators } from '@app/shared/validators/custom-validatos';
import { CatalogsService } from '@app/shared/services/catalogs.service';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import moment from 'moment';
import * as entityCatalogs from '../../../../shared/models/catalogs-models';
import * as entity from '../assets-model';
@Component({
  selector: 'app-new-plant',
  templateUrl: './new-plant.component.html',
  styleUrl: './new-plant.component.scss'
})
export class NewPlantComponent implements OnInit, AfterViewInit, OnDestroy{
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
    assetStatus: ['', [Validators.required]],
    netZero: ['', [Validators.required]],
  });

  catContractType:entityCatalogs.DataCatalogs[] = [];
  catInstallationType:entityCatalogs.DataCatalogs[] = [];
  catPlantStatus:entityCatalogs.DataCatalogs[] = [];

  showLoader: boolean = false;
  loading: boolean = false;
  objEditData!:entity.DataPlant;
  
  constructor(
    private catalogsService: CatalogsService, 
    private notificationService: OpenModalsService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private moduleServices: AssetsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getCatalogs()
  }
  
  ngAfterViewInit(): void {
  }
  
  getId() {
    this.activatedRoute.params.pipe(takeUntil(this.onDestroy)).subscribe((params: any) => {
      if (params.id) this.getDataById(params.id);
    });
  }

  getDataById(id: string) {
    this.moduleServices.getDataId(id).subscribe({
      next: (response: entity.DataPlant | any) => {
        console.log(response);
        this.objEditData = response;
        this.formData.patchValue(response)
      },
      error: (error) => {
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert')
        console.error(error)
      }
    })
  }

  getCatalogs() {
    this.catalogsService.getCatPlantStatus().subscribe({
      next: ( response : entityCatalogs.DataCatalogs[] ) => this.catPlantStatus = response ,
      error: (error) => {
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert')
        console.error(error)
      }
    })

    this.catalogsService.getCatContractType().subscribe({
      next: ( response : entityCatalogs.DataCatalogs[] ) => this.catContractType = response,
      error: (error) => {
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert')
        console.error(error)
      }
    });

    this.catalogsService.getCatInstallationType().subscribe({
      next: ( response : entityCatalogs.DataCatalogs[] ) =>  this.catInstallationType = response,
      error: (error) => {
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert')
        console.error(error)
      }
    });
  
    this.catalogsService.getCatInstallationType().subscribe({
      next: ( response : entityCatalogs.DataCatalogs[] ) => this.catInstallationType = response ,
      error: (error) => {
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert')
        console.error(error)
      }
    });

    this.getId();
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

  saveDataPost(objData:entity.DataPlant) {
    this.moduleServices.postDataPlant(objData).subscribe({
      next: () => {
        this.completionMessage()
      },
      error: (error) => {
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert')
        console.error(error)
      }
    })
  }
  
  saveDataPatch(objData:entity.DataPlant) {
    this.moduleServices.patchDataPlant(this.objEditData.id, objData).subscribe({
      next: () => {
        this.completionMessage(true)
      },
      error: (error) => {
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert')
        console.error(error)
      }
    })
  }

  completionMessage(edit = false) {
    this.notificationService
      .notificacion(
        'Éxito',
        `Registro ${edit ? 'editado' : 'guardado'}.`,
        'save',
      )
      .afterClosed()
      .subscribe((_) => this.toBack());
  }
  
  clearForm() {
    this.formData.reset();
  }

  toBack() {
    this.router.navigateByUrl(`/assets/management`)
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
