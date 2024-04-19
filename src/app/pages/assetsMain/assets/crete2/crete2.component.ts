import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AssetsService } from '../assets.service';
import { CustomValidators } from '@app/shared/validators/custom-validatos';

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
    googleMapsLink: ['', [Validators.required, CustomValidators.validateUrlPrefix]],
    latitude: [null, [Validators.required, CustomValidators.validateLatitude]],
    longitude: [null, [Validators.required, CustomValidators.validateLongitude]]
  });

  
  toBack() {
    this.router.navigateByUrl('/assets/management')
  }
}
