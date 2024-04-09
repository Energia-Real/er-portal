import { Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AssetsService } from '../assets.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnDestroy {
  private onDestroy = new Subject<void>();
  
  editAssetForm!: FormGroup;
  assetData: any = {};
  assetId: string | null = '';
  showLoader: boolean = true;
  loading: boolean = false;
  buttonDisabled: boolean = false;

  constructor(private fb: FormBuilder, 
    private assetsService: AssetsService, 
    private route: ActivatedRoute, 
    private router: Router
    ){
    this.editAssetForm = this.fb.group({
      clientId: ['', Validators.required],
      assetStatus: ['', [Validators.required]],
      operationScheme: ['', [Validators.required]],
    });
  }
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.assetId = params.get('assetId');
      this.getDetailsAsset();
    });
  }

  getDetailsAsset(){
    this.assetsService.getDetailAsset(this.assetId).subscribe( data => {
      this.showLoader = false;
      this.assetData = data;
      this.editAssetForm.patchValue({
        clientId: data.idClient,
      })
    }, err =>{
      this.showLoader = false;
      Swal.fire('Error', 'Ha ocurrido un error, por favor intenta más tarde.', 'error');
      console.log(err);
    })
  }

  onSubmit() {
    let bodyRequest = {
      clientId: this.editAssetForm.get("clientId")?.value,
      assetStatus: this.editAssetForm.get("assetStatus")?.value,
      operationScheme: this.editAssetForm.get("operationScheme")?.value
    };
    this.loading = true;
    Swal.fire({
      title: "¿Estás seguro de que deseas editar ésta planta?",
      confirmButtonText: "Editar",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.assetsService.putUpdateAsset(bodyRequest, this.assetId).subscribe(()=>{
          this.loading = false;
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Tu planta se ha editado correctamente.",
            showConfirmButton: false,
            timer: 2300
          });
          setTimeout(()=>{
            this.router.navigate(['/assets/management']);
          }, 2400);
        }, err => {
          this.loading = false;
          Swal.fire('Error', 'Ha ocurrido un error, por favor intenta más tarde.', 'error');
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
    this.editAssetForm.reset();
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
