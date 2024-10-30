import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import * as entity from '../../plants-model';
import { Subject, Subscription } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Highcharts from 'highcharts';
import { PlantsService } from '../../plants.service';
import { Store } from '@ngrx/store';
import { selectDrawer } from '@app/core/store/selectors/drawer.selector';
import { DrawerGeneral } from '@app/shared/models/general-models';
import { updateDrawer } from '@app/core/store/actions/drawer.actions';

@Component({
  selector: 'app-savings',
  templateUrl: './savings.component.html',
  styleUrl: './savings.component.scss'
})
export class SavingsComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();
  drawerOpenSub: Subscription;

  @Input() plantData: entity.DataPlant | any;
  @Input() notData!: boolean;
  @Output() notifyParent: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;


  pdfSrc: SafeResourceUrl = '';
  showAlert: boolean = false;
  Highcharts: typeof Highcharts = Highcharts;
  images: string[] = [];
  renderedImage: string | null = null;
  materialIcon: string = 'edit';
  drawerAction: "Create" | "Edit" = "Create";
  drawerInfo: entity.Equipment | null | undefined = null;
  instalations!: entity.Instalations;
  needReload: boolean = false;
  drawerOpen: boolean = false;

  constructor(
    private sanitizer: DomSanitizer,
    private mopduleService: PlantsService,
    private store: Store
  ) {
    this.drawerOpenSub = this.store.select(selectDrawer).subscribe((resp: DrawerGeneral) => {
      this.drawerOpen = resp.drawerOpen;
      this.drawerAction = resp.drawerAction;
      this.drawerInfo = resp.drawerInfo;
      this.needReload = resp.needReload;
      if (this.needReload) this.reloadData();
    });
  }

  ngOnInit(): void {
    if (this.notData) this.showAlert = true;
    this.getSavings(this.plantData?.id)
  }

  getSavings(plantCode: string) {
    this.mopduleService.getSavings(plantCode).subscribe(data => {
      this.instalations = data;
      this.pdfSrc = this.sanitizeUrl(data.equipmentPath + "#zoom=85");
      this.getInverterMonitoring(data);
    })
  }

  getInverterMonitoring(data: entity.Instalations) {
    let instalations = data.equipment;
    this.mopduleService.getInverterMonitoring(this.plantData?.plantCode).subscribe((data: entity.InverterMonitoring) => {
      this.notifyParent.emit(data.inverterSystemStatus);

      if (data?.invertersStatus?.length) {
        let InvertersStatus = data?.invertersStatus;

        instalations.forEach((item: any) => {
          const matchingItem = InvertersStatus.find((obj: any) => obj.sn === item.serialNumber);
          if (matchingItem) item.status = matchingItem.status;
          else item.status = null;
        });
      }

      this.instalations.equipment = instalations
    })
  }

  getGoogleDriveEmbedLink(link: string): string {
    const fileIdMatch = link.match(/[-\w]{25,}/);
    if (fileIdMatch && fileIdMatch[0]) return `https://drive.google.com/file/d/${fileIdMatch[0]}/preview`;
    return '';
  }

  sanitizeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  reloadData() {
    this.getSavings(this.plantData?.plantCode);
    this.store.dispatch(updateDrawer({ drawerOpen: false, drawerAction: "Create", drawerInfo: null, needReload: false }));
  }

  onPageRendered(event: CustomEvent): void {
    const canvas: HTMLCanvasElement = event.target as HTMLCanvasElement;
    this.renderedImage = canvas.toDataURL('image/png');
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
