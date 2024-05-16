import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
  static validateUrlPrefix(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value;

    if (!value) return null;

    const allowedPrefixes = [
      'https://goo.gl',
      'https://maps.app.goo.gl',
      'https://www.google.com.mx/maps'
    ];

    const isValidPrefix = allowedPrefixes.some(prefix => value.startsWith(prefix));
    return isValidPrefix ? null : { 'urlPrefix': true };
  }

  static validateLatitude(control: AbstractControl): ValidationErrors | null {
    const latitude = parseFloat(control.value);
    if (latitude || latitude < -90 || latitude > 90) return { 'latitudeInvalid': true };

    return null;
  }

  static validateLongitude(control: AbstractControl): ValidationErrors | null {
    const longitude = parseFloat(control.value);
    if (longitude || longitude < -180 || longitude > 180) return { 'invalidLongitude': true };
    
    return null;
  }
}
