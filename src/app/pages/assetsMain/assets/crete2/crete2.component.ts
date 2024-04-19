import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AssetsService } from '../assets.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-crete2',
  templateUrl: './crete2.component.html',
  styleUrl: './crete2.component.scss'
})
export class Crete2Component {


  constructor(private fb: FormBuilder,
    private assetsService: AssetsService,
    private router: Router
  ) { }

  formData = this.fb.group({
    name: ['', Validators.required],
    name2: ['', Validators.required],
    contractType: ['', Validators.required],
    installationType: ['', [Validators.required]],
    installedCapacity: [null, [Validators.required]],
    googleMapsLink: ['', [Validators.required, this.validateUrlPrefix]],
    latitude: [null, [Validators.required, this.validateLatitude]],
    longitude: [null, [Validators.required, this.validateLongitude]]
  });

  
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
}
