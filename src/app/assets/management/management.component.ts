import { Component } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AssetsService } from '@app/_services/assets.service';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrl: './management.component.scss'
})
export class ManagementComponent {

  displayedColumns: string[] = ['siteName', 'clientId', 'commissionDate', 'inverterQty', 'systemSize', 'googleMapAdress', 'actions'];
  dataSource = new MatTableDataSource<any>([]);
  totalItems: number = 0;
  dataSummary: any = {};

  searchValue: string = '';

  itemsPerPageOptions: number[] = [5, 10, 20, 50];
  pageSize = 5;

  showLoader: boolean = true;

  constructor(
    private assetsServices: AssetsService,
    private router: Router) { }

  ngOnInit(): void {
    this.getTableData(1, ' ');
    this.getSummary();
  };

  getTableData(page: number, name: string) {
    this.assetsServices.getDataAssetsmanagement(name, this.pageSize, page).subscribe({
      next: resp => {
        this.dataSource.data = resp.data;
        if (this.dataSource.paginator) {
          this.dataSource.paginator.pageSize = this.pageSize;
        }
        this.totalItems = resp.totalItems;
        this.showLoader = false;
      },
      error: error => {
        console.log(error);
      }
    })
  };

  getSummary() {
    this.assetsServices.getSummaryProjects().subscribe(data => {
      console.log(data);
      this.dataSummary = data;
      this.showLoader = false;
    }, err => {
      this.showLoader = false;
    })
  }

  searchData() {
    this.getTableData(1, this.searchValue);
  }

  public navigate(link: string) {
    this.router.navigateByUrl(link);
  }

  public getServerData(event?: PageEvent) {
    this.pageSize = event?.pageSize ?? 5;
    this.getTableData(event?.pageIndex ?? 1, ' ');
    return event;
  }
}
