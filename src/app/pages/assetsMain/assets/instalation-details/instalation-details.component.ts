import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import * as entity from '../assets-model';
import Highcharts from 'highcharts';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AssetsService } from '../assets.service';
import { Store } from '@ngrx/store';
import { Subject, Subscription } from 'rxjs';
import { selectDrawer } from '@app/core/store/selectors/drawer.selector';
import { updateDrawer } from '@app/core/store/actions/drawer.actions';
import { DrawerGeneral } from '@app/shared/models/general-models';

@Component({
  selector: 'app-instalation-details',
  templateUrl: './instalation-details.component.html',
  styleUrls: ['./instalation-details.component.scss']
})
export class InstalationDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  private onDestroy$ = new Subject<void>();

  @Input() assetData!: entity.DataPlant;
  @Input() notData!: boolean;
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @Output() notifyParent: EventEmitter<any> = new EventEmitter<any>();

  drawerOpen = false;
  pdfSrc: SafeResourceUrl = '';
  showAlert: boolean = false;
  Highcharts: typeof Highcharts = Highcharts;
  images: string[] = [];
  renderedImage: string | null = null;
  materialIcon: string = 'edit';
  drawerAction: "Create" | "Edit" = "Create";
  drawerOpenSub: Subscription;
  drawerInfo: entity.Equipment | null | undefined = null;
  instalations!: entity.Instalations;
  needReload: boolean = false;

  constructor(
    private sanitizer: DomSanitizer,
    private assetService: AssetsService,
    private store: Store,

  ) {
    this.drawerOpenSub = this.store.select(selectDrawer).subscribe((resp:DrawerGeneral) => {
      this.drawerOpen = resp.drawerOpen;
      this.drawerAction = resp.drawerAction;
      this.drawerInfo = resp.drawerInfo;
      this.needReload = resp.needReload;
      if (this.needReload) {
        this.reloadData();
      }
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

  getInstalations(plantCode: string) {
    this.assetService.getInstalations(plantCode).subscribe(data => {
      this.instalations = data;
      this.pdfSrc = this.sanitizeUrl(data.equipmentPath + "#zoom=85");

      this.getInstalationsInverterMonitoring(data)
    })
  }

  getInstalationsInverterMonitoring(data: entity.Instalations) {
    let instalations = data.equipment;
    this.assetService.getInstalationsInverterMonitoring(this.assetData?.plantCode).subscribe((data: entity.InverterMonitoring) => {
      this.notifyParent.emit(data.inverterSystemStatus);  

      if (data?.invertersStatus?.length) {
        let InvertersStatus = data?.invertersStatus;
        instalations.forEach((item: any) => {
          const matchingItem = InvertersStatus.find((obj: any) => obj.sn === item.serialNumber);
          if (matchingItem) {
            item.status = matchingItem.status;
          } else {
            item.status = null;
          }
        });
      }

      this.instalations.equipment = instalations
    })
  }

  reloadData() {
    this.getInstalations(this.assetData?.plantCode);
    this.store.dispatch(updateDrawer({ drawerOpen: false, drawerAction: "Create", drawerInfo: null, needReload: false }));
  }

  toggleDrawer() {
    this.updDraweState(!this.drawerOpen);
  }

  updDraweState(estado: boolean): void {
    this.store.dispatch(updateDrawer({ drawerOpen: estado, drawerAction: "Create", drawerInfo: null, needReload: false }));
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }
}
