import { Component, OnDestroy, OnInit } from '@angular/core';
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
export class NewPlantComponent implements OnInit, OnDestroy {
  private onDestroy = new Subject<void>();

  formData = this.fb.group({
    siteName: ['', Validators.required],
    plantCode: [''],
    direction: [''],
    link: ['', CustomValidators.validateUrlPrefix],
    contractTypeId: [''],
    latitude: ['', CustomValidators.validateLatitude],
    longitude: ['', CustomValidators.validateLongitude],
    installationTypeId: [''],
    performanceRatio: [''],
    yearlyYield: [''],
    nominalPowerAC: [''],
    commissionDate: [''],
    installedCapacity: [''],
    contractSignatureDate: [''],
    endInstallationDate: [''],
    systemSize: [''],
    inverterQty: [''],
    statusPlantId: [''],
    netZero: [''],
  });

  catContractType: entityCatalogs.DataCatalogs[] = [];
  catInstallationType: entityCatalogs.DataCatalogs[] = [];
  catPlantStatus: entityCatalogs.DataCatalogs[] = [];

  showLoader: boolean = false;
  loading: boolean = false;
  objEditData!: entity.DataPlant;

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

  getId() {
    this.activatedRoute.params.pipe(takeUntil(this.onDestroy)).subscribe((params: any) => {
      if (params.id) this.getDataById(params.id);
    });
  }

  getDataById(id: string) {
    this.moduleServices.getDataId(id).subscribe({
      next: (response: entity.DataPlant | any) => {
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
      next: (response: entityCatalogs.DataCatalogs[]) => this.catPlantStatus = response,
      error: (error) => {
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert')
        console.error(error)
      }
    })

    this.catalogsService.getCatContractType().subscribe({
      next: (response: entityCatalogs.DataCatalogs[]) => this.catContractType = response,
      error: (error) => {
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert')
        console.error(error)
      }
    });

    this.catalogsService.getCatInstallationType().subscribe({
      next: (response: entityCatalogs.DataCatalogs[]) => this.catInstallationType = response,
      error: (error) => {
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert')
        console.error(error)
      }
    });

    this.catalogsService.getCatInstallationType().subscribe({
      next: (response: entityCatalogs.DataCatalogs[]) => this.catInstallationType = response,
      error: (error) => {
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert')
        console.error(error)
      }
    });

    this.getId();
  }

  actionSave() {
    // const objData: any = { ...this.formData.value }
    const objData: any = {}

    if (this.formData.get('siteName')?.value) objData.siteName = this.formData.get('siteName')?.value;
    if (this.formData.get('plantCode')?.value) objData.plantCode = this.formData.get('plantCode')?.value;
    if (this.formData.get('direction')?.value) objData.direction = this.formData.get('direction')?.value;
    if (this.formData.get('link')?.value) objData.link = this.formData.get('link')?.value;
    if (this.formData.get('performanceRatio')?.value) objData.performanceRatio = this.formData.get('performanceRatio')?.value;
    if (this.formData.get('yearlyYield')?.value) objData.yearlyYield = this.formData.get('yearlyYield')?.value;
    if (this.formData.get('nominalPowerAC')?.value) objData.nominalPowerAC = this.formData.get('nominalPowerAC')?.value;
    if (this.formData.get('contractTypeId')?.value) objData.contractTypeId = this.formData.get('contractTypeId')?.value;
    if (this.formData.get('latitude')?.value) objData.latitude = this.formData.get('latitude')?.value;
    if (this.formData.get('longitude')?.value) objData.longitude = this.formData.get('longitude')?.value;
    if (this.formData.get('installationTypeId')?.value) objData.installationTypeId = this.formData.get('installationTypeId')?.value;
    if (this.formData.get('commissionDate')?.value) objData.commissionDate = this.formData.get('commissionDate')?.value;
    if (this.formData.get('installedCapacity')?.value) objData.installedCapacity = this.formData.get('installedCapacity')?.value;
    if (this.formData.get('systemSize')?.value) objData.systemSize = this.formData.get('systemSize')?.value;
    if (this.formData.get('inverterQty')?.value) objData.inverterQty = this.formData.get('inverterQty')?.value;
    if (this.formData.get('statusPlantId')?.value) objData.statusPlantId = this.formData.get('statusPlantId')?.value;
    if (this.formData.get('netZero')?.value) objData.netZero = this.formData.get('netZero')?.value;
    if (this.formData.get('commissionDate')?.value) objData.commissionDate = moment(this.formData.get('commissionDate')?.value).format('YYYY-MM-DD');
    if (this.formData.get('endInstallationDate')?.value) objData.endInstallationDate = moment(this.formData.get('endInstallationDate')?.value).format('YYYY-MM-DD');
    if (this.formData.get('contractSignatureDate')?.value) objData.contractSignatureDate = moment(this.formData.get('contractSignatureDate')?.value).format('YYYY-MM-DD');

    if (this.objEditData) this.saveDataPatch(objData);
    else this.saveDataPost(objData);
  }

  saveDataPost(objData: entity.DataPlant) {
    this.moduleServices.postDataPlant(objData).subscribe({
      next: () => { this.completionMessage() },
      error: (error) => {
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert')
        console.error(error)
      }
    })
  }

  saveDataPatch(objData: entity.DataPlant) {
    this.moduleServices.patchDataPlant(this.objEditData.id, objData).subscribe({
      next: () => { this.completionMessage(true) },
      error: (error) => {
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert')
        console.error(error)
      }
    })
  }

  completionMessage(edit = false) {
    this.notificationService
      .notificacion(`Registro ${edit ? 'editado' : 'guardado'}.`, 'save')
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
