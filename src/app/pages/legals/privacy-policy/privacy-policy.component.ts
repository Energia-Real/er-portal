import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Subject } from 'rxjs';
import { Location } from '@angular/common';
import { TranslationService } from '@app/shared/services/i18n/translation.service';

@Component({
    selector: 'app-privacy-policy',
    templateUrl: './privacy-policy.component.html',
    styleUrl: './privacy-policy.component.scss',
    standalone: false
})
export class PrivacyPolicyComponent implements OnDestroy {
  private onDestroy$ = new Subject<void>();

  pdfSources = {
    english: '../../../../assets/pdfs/Aviso de privacidad - inglés.pdf',
    spanish: '../../../../assets/pdfs/Aviso de privacidad - español.pdf'
  };

  selectedLanguage: 'english' | 'spanish' = 'english';

  constructor(
    private dialog: MatDialog,
    private location: Location,
    private translationService: TranslationService,

  ) { }

  onTabChange(event: MatTabChangeEvent) {
    this.selectedLanguage = event.index === 1 ? 'spanish' : 'english';
  }

  downloadPDF() {
    const pdfUrl = this.pdfSources[this.selectedLanguage];
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `Privacy Policy - ${this.selectedLanguage.toUpperCase()}.pdf`; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  goBack() {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
