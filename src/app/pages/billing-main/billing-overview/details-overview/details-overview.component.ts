import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NOTIFICATION_CONSTANTS } from '@app/core/constants/notification-constants';
import { Subject } from 'rxjs';
import { BillingService } from '../../billing.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { updateDrawer } from '@app/core/store/actions/drawer.actions';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { updatePagination } from '@app/core/store/actions/paginator.actions';
import * as entity from '../../billing-model';

@Component({
  selector: 'app-details-overview',
  templateUrl: './details-overview.component.html',
  styleUrl: './details-overview.component.scss'
})
export class DetailsOverviewComponent implements OnInit {
  ADD = NOTIFICATION_CONSTANTS.ADD_CONFIRM_TYPE;
  CANCEL = NOTIFICATION_CONSTANTS.CANCEL_TYPE;
  EDIT = NOTIFICATION_CONSTANTS.EDIT_CONFIRM_TYPE;
  DELETE = NOTIFICATION_CONSTANTS.DELETE;
  ERROR = NOTIFICATION_CONSTANTS.ERROR_TYPE;

  private onDestroy$ = new Subject<void>();
  private _client?: any | null | undefined;
  private notificationId?: string;

  get client(): any | null | undefined { return this._client }

  dataSource = new MatTableDataSource<any>([]);
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  pageSize: number = 10;
  pageIndex: number = 1;
  totalItems: number = 0;
  displayedColumns: string[] = [
    'subClient',
    'rate',
    'production',
    'previousPayDate',
    'totalAmount',
  ];

  billingData:any = null;

  @Input() isOpen = false;
  @Input() modeDrawer: "Edit" | "Create" = "Create";
  @Input() set billing(billingData: any | null | undefined) {
    if (billingData) {
      console.log(billingData);
      this.billingData = billingData;
      this.getBillingDetails()
    }
  }

  formData = this.fb.group({
    name: ['', Validators.required],
    tipoDeClienteId: ['', Validators.required],
    clientId: ['', Validators.maxLength(4)],
    image: [null as File | null]
  });

  constructor(
    private moduleServices: BillingService,
    private fb: FormBuilder,
    private store: Store,

  ) { }

  ngOnInit(): void {

    
  }

  getBillingDetails() {
    const filters: any = {
      pageSize: this.pageSize,
      page: this.pageIndex,
      year: this.billingData.year,
      // clientId: this.getUserClient.clientes[0]
    };

    console.log('getBillingDetails', filters);
    
    // this.moduleServices.getBillingHistory(filters).subscribe({
    //   next: (response: entity.DataHistoryOverviewTableMapper) => {
    //     console.log('getBillingHistory', response);
    //     this.dataSource.data = response?.data;
    //     this.totalItems = response?.totalItems;
    //     this.dataSource.sort = this.sort;
    //     this.pageIndex = filters.page;
    //   },
    //   error: error => {
    //     // this.notificationService.notificacion(`Talk to the administrator.`, 'alert');
    //     console.log(error);
    //   }
    // });
  }

  changePageSize(event: any) {
    const newSize = event.value;
    this.pageSize = newSize;

    if (this.paginator) {
      this.paginator.pageSize = newSize;
      this.paginator._changePageSize(newSize);
    }

    this.getBillingDetails();
  }

  closeDrawer(reload: boolean) {
    this.isOpen = false;
    setTimeout(() => {
      // this.cancelEdit()
    }, 300);
    this.store.dispatch(updateDrawer({ drawerOpen: false, drawerAction: "Create", drawerInfo: null, needReload: reload }));
  }

  getServerData(event: PageEvent): void {
    if (event.pageSize !== this.pageSize || event.pageIndex !== this.pageIndex - 1) {
      this.store.dispatch(updatePagination({ pageIndex: event.pageIndex, pageSize: event.pageSize }));
    }
  }
}
