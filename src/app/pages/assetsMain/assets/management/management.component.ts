import { Component, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AssetsService } from '../assets.service';
import { Subject } from 'rxjs';
declare let gtag: Function;
import * as entity from '../assets-model';
import { OpenModalsService } from '@app/shared/services/openModals.service';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrl: './management.component.scss'
})
export class ManagementComponent implements OnDestroy {
  private onDestroy = new Subject<void>();
  dataSource = new MatTableDataSource<any>([]);

  displayedColumns: string[] = [
    'siteName', 
    'clientId', 
    'commissionDate', 
    'inverterQty', 
    'systemSize', 
    'googleMapAdress', 
    'actions'
  ];

  totalItems: number = 0;

  searchValue: string = '';
  totalPlants: any;

  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageSize = 5;

  showLoader: boolean = true;
  loadingtotalPlants: boolean = true;


  constructor(
    private assetsServices: AssetsService,
    private notificationService: OpenModalsService,
    private router: Router) { }

  ngOnInit(): void {
    this.getDataResponse(1, ' ');
    this.getSummaryProjects();
  };

  getDataResponse(page: number, name: string) {
    this.assetsServices.getDataAssetsmanagement(name, this.pageSize, page).subscribe({
      next: response => {
        console.log(response);
        this.dataSource.data = response.data;
        if (this.dataSource.paginator) this.dataSource.paginator.pageSize = this.pageSize;
        this.totalItems = response.totalItems;
        this.showLoader = false;
      },
      error: error => {
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert')
        console.log(error);
      }
    })
  };
  
  getSummaryProjects() {
    this.assetsServices.getSummaryProjects().subscribe({
      next: (response : entity.DataSummaryProjects) => {
        console.log(response);
        this.totalPlants = response;
        this.loadingtotalPlants = false
      },
      error: error => {
        this.loadingtotalPlants = false;
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert')
        console.log(error);
      }
    })
  };

  searchData() {
    this.getDataResponse(1, this.searchValue);
  }

  public navigate(link: string) {
    this.router.navigateByUrl(link);
  }

  public getServerData(event?: PageEvent) {
    this.pageSize = event?.pageSize ?? 5;
    this.getDataResponse(event?.pageIndex ?? 1, ' ');
    return event;
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
