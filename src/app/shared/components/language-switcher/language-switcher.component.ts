import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService } from '../../services/i18n/translation.service';
import { MaterialModule } from '@app/shared/material/material.module';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  styleUrls: ['./language-switcher.component.scss'],
  standalone: true,
  imports: [CommonModule,MaterialModule]
})
export class LanguageSwitcherComponent {
  constructor(public translationService: TranslationService) {}

  changeLanguage(lang: string): void {
    this.translationService.setLanguage(lang);
  }

  getCurrentLang(): string {
    return this.translationService.getCurrentLanguage();
  }
}
