import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/i18n/translation.service';

@Component({
  selector: 'app-translation-example',
  templateUrl: './translation-example.component.html',
  standalone: true,
  imports: [TranslateModule, CommonModule]
})
export class TranslationExampleComponent {
  constructor(public translationService: TranslationService) {}

  // Método para obtener una traducción de forma reactiva
  getTranslation(key: string, params?: object) {
    return this.translationService.getTranslation(key, params);
  }

  // Método para obtener una traducción de forma instantánea
  getInstantTranslation(key: string, params?: object) {
    return this.translationService.instant(key, params);
  }
}
