import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as entity from '../assets-model';
import Highcharts from 'highcharts';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AssetsService } from '../assets.service';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { selectDrawer } from '@app/core/store/selectors/drawer.selector';
import { updateDrawer } from '@app/core/store/actions/drawer.actions';

@Component({
  selector: 'app-instalation-details',
  templateUrl: './instalation-details.component.html',
  styleUrls: ['./instalation-details.component.scss']
})
export class InstalationDetailsComponent implements OnInit, AfterViewInit {
  @Input() assetData!: entity.DataPlant;
  @Input() notData!: boolean;
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  drawerOpen = false;
  pdfSrc: SafeResourceUrl = '';
  showAlert: boolean = false;
  Highcharts: typeof Highcharts = Highcharts;
  images: string[] = [];
  renderedImage: string | null = null;
  materialIcon: string = 'edit';
  drawerAction: "Create"|"Edit" = "Create";
  drawerOpenSub: Subscription;
  drawerInfo: entity.Equipment | null | undefined = null;
  instalations!:entity.Instalations;

  constructor(
    private sanitizer: DomSanitizer, 
    private assetService: AssetsService,
    private store: Store,

  ) {
    this.drawerOpenSub =  this.store.select(selectDrawer).subscribe(resp => {
      this.drawerOpen  = resp.drawerOpen;
      this.drawerAction = resp.drawerAction;
      this.drawerInfo = resp.drawerInfo;
    });
  }

  ngOnInit(): void {
    if (this.notData) this.showAlert = true;
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
      this.pdfSrc = this.sanitizeUrl(data.equipmentPath+"#zoom=85");
      console.log(this.instalations)
    })
  }

  
  toggleDrawer() {
    this.updDraweState(!this.drawerOpen);
  }
  
  updDraweState(estado: boolean): void {
    this.store.dispatch(updateDrawer({drawerOpen:estado,drawerAction: "Create", drawerInfo: null }));
  }
}
