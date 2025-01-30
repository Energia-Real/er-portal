import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { updateDrawer } from '@app/core/store/actions/drawer.actions';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import * as entity from '../energy-production-model';

import { OpenModalsService } from '@app/shared/services/openModals.service';
import { EnergyProductionService } from '../energy-production.service';

@Component({
  selector: 'app-energy-prod-update',
  templateUrl: './energy-prod-update.component.html',
  styleUrl: './energy-prod-update.component.scss'
})
export class EnergyProdUpdateComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();
  private _plant?: any | null | undefined;

  get plant(): any | null | undefined { return this._plant }

  @Input() isOpen = false;
  @Input() modeDrawer: "Edit" | "Create" = "Create";
  @Input() set plant(editedData: any | null | undefined) {
    console.log(editedData);
    this.editedPlant = editedData;

    function limpiarNumerosConFormato(value: string): number {
      return parseFloat(value.replace(/,/g, ''));
    }
    const dataLimpia = {
      ...editedData,
      energyValue: editedData.energyValue ? limpiarNumerosConFormato(editedData.energyValue) : null
    };
    this.formData.patchValue({
      ...dataLimpia
    })
  }

  formData = this.fb.group({
    siteName: [{ value: '', disabled: true }, Validators.required],
    monthSelected: [{ value: '', disabled: true }, Validators.required],
    monthSelectedName: [{ value: '', disabled: true }, Validators.required],
    year: [{ value: '', disabled: true }, Validators.required],
    yearName: [{ value: '', disabled: true }, Validators.required],
    energyValue: [{ value: '', disabled: false }, Validators.required],
  });

  editedPlant: any;

  imagePreview: string | ArrayBuffer | null = null;

  constructor(
    private moduleServices: EnergyProductionService,
    private notificationService: OpenModalsService,
    private store: Store,
    private fb: FormBuilder
  ) { }

  ngOnInit() { }

  actionSave(deleteEnergyProd?:boolean) {
    if (!this.formData.valid) return

    const objData: any = {
      ...this.editedPlant,
      ...this.formData.value
    };
    console.log(objData)
    delete objData.monthSelectedName;
    delete objData.siteName;
    delete objData.yearName;
    delete objData.energyType;
    delete objData.isCreated;


    if (deleteEnergyProd) objData.deleteEnergyValue = true;
     else objData.deleteEnergyValue = false;

    if (this.editedPlant?.isCreated) this.saveDataPatch(objData);
    else this.saveDataPost(objData);
  }

  saveDataPost(objData: entity.DataPostEnergyProd) {
    this.moduleServices.postDataEnergyProd(objData).subscribe({
      next: () => { this.completionMessage() },
      error: (error) => {
        this.notificationService.notificacion(`Hable con el administrador.`, 'alert');
        console.error(error)
      }
    })
  }

  saveDataPatch(objData: entity.DataPatchEnergyProd) {

    if(this.editedPlant.energyType == 1){
      this.moduleServices.patchDataEnergyProd(objData).subscribe({
        next: () => { this.completionMessage(true) },
        error: (error) => {
          this.notificationService.notificacion(`Hable con el administrador.`, 'alert');
          console.error(error)
        }
      })
    }
    else if(this.editedPlant.energyType == 2){
      this.moduleServices.patchDataEnergyCon(objData).subscribe({
        next: () => { this.completionMessage(true) },
        error: (error) => {
          this.notificationService.notificacion(`Hable con el administrador.`, 'alert');
          console.error(error)
        }
      })
    }
    else{
      this.moduleServices.patchDataEnergyEstim(objData).subscribe({
        next: () => { this.completionMessage(true) },
        error: (error) => {
          this.notificationService.notificacion(`Hable con el administrador.`, 'alert');
          console.error(error)
        }
      })
    }
    
  }

  cancelEdit() {
    this.formData.reset();
    this.formData.markAsPristine();
    this.formData.markAsUntouched();
    this.editedPlant = null;
  }

  closeDrawer(cancel?:boolean) {
    this.isOpen = false;
    setTimeout(() => this.cancelEdit(), 300);
    this.store.dispatch(updateDrawer({ drawerOpen: false, drawerAction: "Create", drawerInfo: null, needReload: cancel ? false : true }));
  }

  completionMessage(edit = false) {
    this.notificationService
      .notificacion(`Record ${edit ? 'editado' : 'guardado'}.`, 'save')
      .afterClosed()
      .subscribe((_ => this.closeDrawer()));
  }

  validateInput(event: any): void {
    const inputValue = event.target.value;

    if (inputValue <= 0) {
      event.target.value = '';
      this.formData.controls['energyValue'].setValue('');
    }
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }

}
