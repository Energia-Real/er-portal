import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '@environment/environment';
import { TranslationService } from '@app/shared/services/i18n/translation.service';


@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrl: './contact.component.scss',
    standalone: false
})
export class ContactComponent {

    urlMap!: SafeResourceUrl;
  

  constructor(
    private location: Location,
    private sanitizer: DomSanitizer,
    private translationService: TranslationService,


  ){
    this.urlMap = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.google.com/maps/embed/v1/place?key=${environment.GOOGLE_API_KEY}&q=Energía+Real,México&zoom=14&maptype=roadmap`
    );
  }

  
  return() {
    this.location.back();
  }

}
