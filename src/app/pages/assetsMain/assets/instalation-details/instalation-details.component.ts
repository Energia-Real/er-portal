import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as entity from '../assets-model';
import Highcharts from 'highcharts';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AssetsService } from '../assets.service';

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
  instalations!:entity.Instalations;
  constructor(
    private sanitizer: DomSanitizer, 
    private assetService: AssetsService
  ) {}

  ngOnInit(): void {
    if (this.notData) this.showAlert = true;
    const googleDriveLink = 'https://drive.google.com/file/d/1lgQftv0wuVvwhkUfbWtuRCWHs84A_KL6/view?usp=sharing';
    this.pdfSrc = this.sanitizeUrl(this.getGoogleDriveEmbedLink(googleDriveLink));
    this.getInstalations(this.assetData.id)
  }

  ngAfterViewInit(): void {
  }

  onPageRendered(event: CustomEvent): void {
    const canvas: HTMLCanvasElement = event.target as HTMLCanvasElement;
    this.renderedImage = canvas.toDataURL('image/png');
  }

  private getGoogleDriveEmbedLink(link: string): string {
    const fileIdMatch = link.match(/[-\w]{25,}/);
    if (fileIdMatch && fileIdMatch[0]) {
      return `https://drive.google.com/file/d/${fileIdMatch[0]}/preview`;
    }
    return '';
  }

  private sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getInstalations(plantCode:string){
    this.assetService.getInstalations(plantCode).subscribe(data=>{
      this.instalations = data;
      console.log(data)
    })

  }
}
