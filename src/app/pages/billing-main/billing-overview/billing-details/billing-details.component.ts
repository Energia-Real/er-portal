import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, distinctUntilChanged, Observable, Subject, takeUntil } from 'rxjs';
import { BillingService } from '../../billing.service';
import { EncryptionService } from '@app/shared/services/encryption.service';
import { FormBuilder } from '@angular/forms';
import { catalogResponseList, FilterBillingDetails } from '../../billing-model';
import { GeneralFilters, GeneralResponse } from '@app/shared/models/general-models';
import { Store } from '@ngrx/store';
import { DataCatalogs } from '@app/shared/models/catalogs-models';

@Component({
  selector: 'app-billing-details',
  templateUrl: './billing-details.component.html',
  styleUrl: './billing-details.component.scss'
})
export class BillingDetailsComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();
  generalFilters$!: Observable<GeneralFilters>;
  generalFilters!: GeneralFilters
  clientsCatalog!:DataCatalogs[];
  legalNameCatalog!:DataCatalogs[];
  sitesCatalog!:DataCatalogs[];
  productsCatalog!:DataCatalogs[];






  filtersForm = this.fb.group({
    customerName: [''],
    legalName: [''],
    siteName: [''],
    productType: [''],
  });

  constructor(
    private fb: FormBuilder,
    private encryptionService: EncryptionService,
    private moduleServices: BillingService,
    private store: Store<{ filters: GeneralFilters }>,
  ) {
    this.generalFilters$ = this.store.select(state => state.filters);
    combineLatest([
      this.generalFilters$.pipe(distinctUntilChanged()),
    ])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(([generalFilters]) => {
        this.generalFilters = generalFilters;
        //this.getBilling();
      });
  }

  ngOnInit(): void { 
    this.getClients();
    this.getProducts();

    this.filtersForm.get('customerName')?.valueChanges
    .pipe(takeUntil(this.onDestroy$))
    .subscribe(valor => {
      this.getLegalNames(valor!)
    });

    this.filtersForm.get('legalName')?.valueChanges
    .pipe(takeUntil(this.onDestroy$))
    .subscribe(valor => {
      this.getSites(valor!)
    });

   

  }

  get filterData(): FilterBillingDetails {
    return {
      ...this.filtersForm.value,
      year:Number( this.generalFilters?.year),
      page:1,
      pageSize:10
    } as FilterBillingDetails;
  }

  getClients(){
    this.moduleServices.getClientCatalog().subscribe({
      next:(resp: GeneralResponse<catalogResponseList>) => {
        this.clientsCatalog = resp.response.catalogResponseList
      }
    })
  }

  getLegalNames(clientid:string){
    this.moduleServices.getLegalNameCatalog(clientid).subscribe({
      next:(resp: GeneralResponse<catalogResponseList>) => {
        this.legalNameCatalog = resp.response.catalogResponseList
      }
    })
  }
  getSites(legalName:string){
    this.moduleServices.getSitesCatalog(legalName).subscribe({
      next:(resp: GeneralResponse<catalogResponseList>) => {
        this.sitesCatalog = resp.response.catalogResponseList
      }
    })
  }

  getProducts(){
    this.moduleServices.getProductTypesCatalog().subscribe({
      next:(resp: GeneralResponse<catalogResponseList>) => {
        this.productsCatalog = resp.response.catalogResponseList
        console.log()
      }
    })
  }


  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }
}
