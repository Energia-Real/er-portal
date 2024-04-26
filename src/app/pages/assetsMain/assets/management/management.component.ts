import { Component, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AssetsService } from '../assets.service';
import { Subject } from 'rxjs';
declare let gtag: Function;

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
  dataSummary: any = {};

  searchValue: string = '';

  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageSize = 5;

  showLoader: boolean = true;

  constructor(
    private assetsServices: AssetsService,
    private router: Router) { }

  ngOnInit(): void {
    this.getDataResponse(1, ' ');
    this.getSummary();
  };

  getDataResponse(page: number, name: string) {
    this.assetsServices.getDataAssetsmanagement(name, this.pageSize, page).subscribe({
      next: response => {
        console.log('DATOS TABLA', response.data);
        
        this.dataSource.data = response.data;
        if (this.dataSource.paginator) {
          this.dataSource.paginator.pageSize = this.pageSize;
        }

        this.totalItems = response.totalItems;
        this.showLoader = false;
      },
      error: error => {
        console.log(error);
      }
    })
  };

  getSummary() {
    this.assetsServices.getSummaryProjects().subscribe(data => {
      this.dataSummary = data;
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    })
  }

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

  sendEvent() {
    gtag('event', 'click', {
      'event_category': 'Botón',
      'event_label': 'Botón de ejemplo'
    });
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.unsubscribe();
  }
}
