import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AssetsService } from '../assets.service';
import { Subject } from 'rxjs';
import { CatalogsService } from '@app/shared/services/catalogs.service';
import { OpenModalsService } from '@app/shared/services/openModals.service';
import * as entityCatalogs from '../../../../shared/models/catalogs-models';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent implements OnDestroy {
  private onDestroy = new Subject<void>();

  formData = this.fb.group({
    name: ['', Validators.required],
    contractType: ['', Validators.required],
    installationType: ['', [Validators.required]],
    installedCapacity: [null, [Validators.required]],
    googleMapsLink: ['', [Validators.required, this.validateUrlPrefix]],
    latitude: [null, [Validators.required, this.validateLatitude]],
    longitude: [null, [Validators.required, this.validateLongitude]]
  });

  catContractType:entityCatalogs.DataCatalogs[] = [];
  catInstallationType:entityCatalogs.DataCatalogs[] = [];

  assetId: string | null = '';
  showLoader: boolean = false;
  loading: boolean = false;
  buttonDisabled: boolean = false;
  errorCreate: boolean = false;

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
      console.log('getCatContractType', response);
      this.catContractType = response;
      },
      error: (error) => {
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert')
        console.error(error)
      }
    });

    this.catalogsService.getCatInstallationType().subscribe({
      next: ( response : entityCatalogs.DataCatalogs[] ) => {
      console.log('InstallationType', response);
      this.catInstallationType = response;
      },
      error: (error) => {
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert')
        console.error(error)
      }
    });
  
    this.catalogsService.getCatInstallationType().subscribe({
      next: ( response : entityCatalogs.DataCatalogs[] ) => {
      console.log('InstallationType', response);
      this.catInstallationType = response;
      },
      error: (error) => {
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert')
        console.error(error)
      }
    });
  }


  onSubmit() {
    this.errorCreate = false;
    let userData = {
      nombre: this.formData.get("name")?.value,
      tipoDeContrato: this.formData.get("contractType")?.value,
      tipoDeInstalacion: this.formData.get("installationType")?.value,
      capacidadInstalada: this.formData.get("installedCapacity")?.value,
      linkGoogleMaps: this.formData.get("googleMapsLink")?.value,
      latitude: this.formData.get("latitude")?.value,
      longitude: this.formData.get("longitude")?.value
    }
    this.loading = true;
    Swal.fire({
      title: "¿Estás seguro de que deseas crear ésta planta?",
      confirmButtonText: "Crear",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.assetsService.postCreateAsset(userData).subscribe(resp => {
          console.log(resp);
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Tu planta se ha creado correctamente.",
            showConfirmButton: false,
            timer: 2500
          });
          setTimeout(()=>{
            this.router.navigate(['/assets/management']);
          }, 2600)
        }, err => {
          console.log(err);
          Swal.fire('Error', 'Ha ocurrido un error inesperado, por favor intenta más tarde.', 'error');
          this.loading = false;
        })
      }
    });
    
  }
  
  validateLatitude(control: AbstractControl): ValidationErrors | null {
    const latitude = parseFloat(control.value);
    if (isNaN(latitude) || latitude < -90 || latitude > 90) {
      return { 'latitudeInvalid': true };
    }
    return null;
  }
  
  validateLongitude(control: AbstractControl): ValidationErrors | null {
    const longitude = parseFloat(control.value);
    if (isNaN(longitude) || longitude < -180 || longitude > 180) {
      return { 'invalidLongitude': true };
    }
    return null;
  }

  validateUrlPrefix(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value;

    if (value && (value.startsWith('https://goo.gl') || 
        value.startsWith('https://maps.app.goo.gl') || 
        value.startsWith('https://www.google.com.mx/maps')
        )) {
      return null;
    }

    return { 'urlPrefix': true };
  };

  clearForm() {
    this.formData.reset();
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
