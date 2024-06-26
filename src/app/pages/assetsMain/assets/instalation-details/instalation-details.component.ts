import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as entity from '../assets-model';
import Highcharts from 'highcharts';
import { PdfViewerComponent as Ng2PdfViewerComponent } from 'ng2-pdf-viewer';

@Component({
  selector: 'app-instalation-details',
  templateUrl: './instalation-details.component.html',
  styleUrl: './instalation-details.component.scss'
})
export class InstalationDetailsComponent implements OnInit, AfterViewInit{
  @Input() assetData!: entity.DataPlant;
  @Input() notData! : boolean;
  @ViewChild(Ng2PdfViewerComponent) private pdfViewer!: Ng2PdfViewerComponent;
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  pdfSrc = '/assets/pdfs/pdf_prueba.pdf';
  showAlert: boolean = false
  Highcharts: typeof Highcharts = Highcharts;
  images: string[] = [];
  renderedImage: string | null = null;


  
  ngOnInit(): void {
    if (this.notData) this.showAlert = true;
  }

  ngAfterViewInit(): void {
    
  }

  onPageRendered(event: CustomEvent): void {
    const canvas: HTMLCanvasElement = event.target as HTMLCanvasElement;
    this.renderedImage = canvas.toDataURL('image/png');
  }


  
}
