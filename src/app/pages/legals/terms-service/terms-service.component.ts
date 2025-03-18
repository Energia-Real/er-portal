import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Subject } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-terms-service',
  templateUrl: './terms-service.component.html',
  styleUrl: './terms-service.component.scss'
})
export class TermsServiceComponent implements OnDestroy  {

  private onDestroy$ = new Subject<void>();

  termsServiceSources = {
    english: '../../../../assets/pdfs/Términos de servicios - inglés.pdf',
    spanish: '../../../../assets/pdfs/ter',
  };

  selectedLanguage: 'english' | 'spanish' = 'english';

  constructor(
    public dialog: MatDialog,
    private location: Location
  ) { }

  onTabChange(event: MatTabChangeEvent) {
    this.selectedLanguage = event.index === 1 ? 'spanish' : 'english';
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
