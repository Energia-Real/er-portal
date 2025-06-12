import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Subject, takeUntil } from 'rxjs';
import { Location } from '@angular/common';
import { TranslationService } from '@app/shared/services/i18n/translation.service';

@Component({
    selector: 'app-terms-service',
    templateUrl: './terms-service.component.html',
    styleUrl: './terms-service.component.scss',
    standalone: false
})
export class TermsServiceComponent implements OnDestroy  {

  private onDestroy$ = new Subject<void>();

  termsServiceSources = {
    english: '../../../../assets/pdfs/Términos de servicios - inglés.pdf',
    spanish: '../../../../assets/pdfs/Terminos de servicio-español.pdf',
  };

  selectedLanguage: 'english' | 'spanish' = 'english';

  constructor(
    private dialog: MatDialog,
    private location: Location,
    private translationService: TranslationService,
  ) {
    this.translationService.currentLang$
    .pipe(takeUntil(this.onDestroy$))
    .subscribe(resp => {
      this.selectedLanguage = resp === "es-MX" ? 'spanish' : 'english';
    });
   }


  downloadPDF() {
    const pdfUrl = this.termsServiceSources[this.selectedLanguage];
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `Terms Of Service - ${this.selectedLanguage.toUpperCase()}.pdf`; 
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
