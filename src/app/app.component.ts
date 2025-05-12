import { Component, OnInit } from '@angular/core';
import { TranslationService } from './shared/services/i18n/translation.service';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: false
})
export class AppComponent implements OnInit {
  constructor(private translationService: TranslationService) {
    // Inicializar el servicio de traducción
    translationService.initialize('es-MX', ['es-MX', 'en-US']);
  }
  ngOnInit(): void {
    
  }
}
