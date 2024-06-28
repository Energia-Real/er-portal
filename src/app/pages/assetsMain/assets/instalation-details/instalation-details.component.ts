import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as entity from '../assets-model';
import Highcharts from 'highcharts';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-instalation-details',
  templateUrl: './instalation-details.component.html',
  styleUrls: ['./instalation-details.component.scss']
})
export class InstalationDetailsComponent implements OnInit, AfterViewInit {
  @Input() assetData!: entity.DataPlant;
  @Input() notData!: boolean;
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  pdfSrc: SafeResourceUrl = '';
  showAlert: boolean = false;
  Highcharts: typeof Highcharts = Highcharts;
  images: string[] = [];
  renderedImage: string | null = null;
  materialIcon: string = 'help_outline';

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    if (this.notData) this.showAlert = true;
    const oneDriveLink = this.convertToEmbedUrl('https://netorgft1186079-my.sharepoint.com/personal/sh_energiareal_mx/_layouts/15/onedrive.aspx?listurl=https%3A%2F%2Fnetorgft1186079%2Esharepoint%2Ecom%2Fsites%2FOperacionesER%2FShared%20Documents&viewid=346b4a7d%2D5e25%2D4195%2Db9ab%2D02f2d56a98a0&id=%2Fsites%2FOperacionesER%2FShared%20Documents%2FCentrales%20El%C3%A9ctricas%20Operando%2FMerco%2FMerco%20Pilares%2F06%20Cierre%20Obra%2F03%20Proyecto%20As%2DBuilt%2F03%20Planos%2F1%2E0%2E0%2EImplantaci%C3%B3n%20general%20Merco%20Pilares%20As%20Built%2D01%2Epdf&parent=%2Fsites%2FOperacionesER%2FShared%20Documents%2FCentrales%20El%C3%A9ctricas%20Operando%2FMerco%2FMerco%20Pilares%2F06%20Cierre%20Obra%2F03%20Proyecto%20As%2DBuilt%2F03%20Planos&parentview=0&OR=Teams-HL&CT=1719603853224&clickparams=eyJBcHBOYW1lIjoiVGVhbXMtRGVza3RvcCIsIkFwcFZlcnNpb24iOiI0OS8yNDA1MzEwMTQyMSIsIkhhc0ZlZGVyYXRlZFVzZXIiOmZhbHNlfQ%3D%3D');
    this.pdfSrc = this.sanitizeUrl(oneDriveLink);
  }

  ngAfterViewInit(): void {
    // Tu código actual después de la vista inicial
  }

  onPageRendered(event: CustomEvent): void {
    const canvas: HTMLCanvasElement = event.target as HTMLCanvasElement;
    this.renderedImage = canvas.toDataURL('image/png');
  }

  private sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  private convertToEmbedUrl(url: string): string {
    // La conversión de URL puede necesitar ajustes específicos dependiendo del formato
    const embedUrl = url.replace('/_layouts/15/onedrive.aspx?', '/_layouts/15/WopiFrame.aspx?')
                        .replace('&action=default', '&action=embedview');
    return embedUrl;
  }
}
