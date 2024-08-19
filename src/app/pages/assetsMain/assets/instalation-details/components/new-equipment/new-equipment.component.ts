import { Component, Input ,OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CatalogEquipment, Equipment } from '../../../assets-model';
import { AssetsService } from '../../../assets.service';
import { Store } from '@ngrx/store';
import { updateDrawer } from '@app/core/store/actions/drawer.actions';
import { Subscription } from 'rxjs';
import { selectDrawer } from '@app/core/store/selectors/drawer.selector';

export interface EquipmentForm {
  inverterBrand: FormControl<number|null>;
  inverterModel: FormControl<number|null>;
  moduleBrand:FormControl<number|null>;
  moduleModel: FormControl<number|null>;
  moduleQty: FormControl<number|null>;
  tilt: FormControl<number|null>;
  orientation:FormControl<number|null>;
}
@Component({
  selector: 'app-new-equipment',
  templateUrl: './new-equipment.component.html',
  styleUrl: './new-equipment.component.scss'
})
export class NewEquipmentComponent {
  @Input() isOpen = false;

  @Input()
  modeDrawer: "Edit" | "Create" = "Create";

  @Input()
  plantCode?:string;

  private _equipment?: Equipment | null | undefined;
  @Input()
  set equipment(value: Equipment | null | undefined) {
    this._equipment = value;
    this.initializeForm();
  }
  get equipment(): Equipment | null | undefined {
    return this._equipment;
  }

  inverterBrands: CatalogEquipment[]=[];
  inverterModels: CatalogEquipment[]=[];
  moduleBrands:   CatalogEquipment[]=[];
  moduleModels:   CatalogEquipment[]=[];

  loading: boolean = false;


  formData: FormGroup<EquipmentForm> = this.fb.group<EquipmentForm>({
    inverterBrand: this.fb.control<number | null>(null, Validators.required),
    inverterModel: this.fb.control<number | null>({ value: null, disabled: true }, Validators.required),
    moduleBrand: this.fb.control<number | null>(null, Validators.required),
    moduleModel: this.fb.control<number | null>({ value: null, disabled: true }, Validators.required),
    moduleQty: this.fb.control<number | null>(null, [Validators.required, Validators.pattern('^[0-9]*$')]),
    tilt: this.fb.control<number | null>(null, [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]),
    orientation: this.fb.control<number | null>(null, [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]),
  });

  constructor(
    private fb: FormBuilder,
    private assetService: AssetsService,
    private store: Store
  ){
    
  }

  ngOnInit(){
    this.getInverterBrandsCatalog(); 
    this.getModuleBrandsCatalog(); 

    this.formData.get('inverterBrand')?.valueChanges.subscribe(value => {
      if (value) {
        this.getInverterModelsCatalog(value)
      } else {
        this.formData.get('inverterModel')?.disable();
      }
    });
    this.formData.get('moduleBrand')?.valueChanges.subscribe(value => {
      if (value) {
        this.getModuleModelsCatalog(value);        
      } else {
        this.formData.get('moduleModel')?.disable();
      }
    });
  }

  initializeForm() {
    if (this.equipment) {
      this.formData.patchValue({
        inverterBrand: this.equipment.inverterBrandId || null,
        inverterModel: this.equipment.inverterModelId || null,
        moduleBrand: this.equipment.moduloBrandId || null,
        moduleModel: this.equipment.moduloModelId || null,
        moduleQty: this.equipment.moduloQty || null,
        tilt: this.equipment.tilt || null,
        orientation: this.equipment.orientation || null,
      });

      // Habilitar los campos deshabilitados si hay valores para ellos
      if (this.equipment.inverterModelId) {
        this.formData.get('inverterModel')?.enable();
      }
      if (this.equipment.moduloModelId) {
        this.formData.get('moduleModel')?.enable();
      }
    } else {
      // Resetear el formulario si no hay equipment
      this.formData.reset({
        inverterBrand: null,
        inverterModel: null,
        moduleBrand: null,
        moduleModel: null,
        moduleQty: null,
        tilt: null,
        orientation: null,
      });
      this.formData.get('inverterModel')?.disable();
      this.formData.get('moduleModel')?.disable();
    }
  }

  closeDrawer() {
    this.isOpen = false;
    this.store.dispatch(updateDrawer({drawerOpen:false, drawerAction: "Create", drawerInfo: null }));

  }

  actionSave() {
    let equipment:Equipment = {};
    const inverterBrandValue = this.formData.get('inverterBrand')?.value;
    const inverterModelValue = this.formData.get('inverterModel')?.value;
    const moduleBrandValue = this.formData.get('moduleBrand')?.value;
    const moduleModelValue = this.formData.get('moduleModel')?.value;
    const moduleQtyValue = this.formData.get('moduleQty')?.value;
    const tiltValue = this.formData.get('tilt')?.value;
    const orientationValue = this.formData.get('orientation')?.value;
console.log("ggg", moduleQtyValue)
    if (inverterBrandValue !== null && inverterBrandValue !== undefined) {
      equipment.inverterBrandId = inverterBrandValue;
    }
    if (inverterModelValue !== null && inverterModelValue !== undefined) {
      equipment.inverterModelId = inverterModelValue;
    }
    if (moduleBrandValue !== null && moduleBrandValue !== undefined) {
      equipment.moduloBrandId = moduleBrandValue;
    }
    if (moduleModelValue !== null && moduleModelValue !== undefined) {
      equipment.moduloModelId = moduleModelValue;
    }
    if (moduleQtyValue !== null && moduleQtyValue !== undefined) {
      equipment.moduloQty = moduleQtyValue;
    }
    if (tiltValue !== null && tiltValue !== undefined) {
      equipment.tilt = tiltValue;
    }
    if (orientationValue !== null && orientationValue !== undefined) {
      equipment.orientation = orientationValue;
    }
    if(this.plantCode){
      equipment.projectExternalId=this.plantCode;
    }

    if(this.modeDrawer=="Create"){
      console.log("saving ...")
      this.assetService.createInstalations(equipment).subscribe(resp=>{
        this.closeDrawer();
      })
    }
    if(this.modeDrawer=="Edit"){
      console.log("editing ....")
      console.log(equipment)

      this.assetService.patchInstalation(
        this._equipment?.equipmentId,
        equipment).subscribe(resp=>{
          this.closeDrawer();

      })
    }
    
  }

  getInverterBrandsCatalog(){
    this.assetService.getInverterBrands().subscribe(resp=>{
      this.inverterBrands=resp; 
    })
  }
  getInverterModelsCatalog(id:number){
    this.assetService.getInverterModels(id).subscribe(resp=>{
      this.inverterModels=resp; 
      this.formData.get('inverterModel')?.enable();
    })
  }
  getModuleBrandsCatalog(){
    this.assetService.getModuleBrands().subscribe(resp=>{
      this.moduleBrands=resp; 
    })
  }
  getModuleModelsCatalog(id:number){
    this.assetService.getModuleModels(id).subscribe(resp=>{
      this.formData.get('moduleModel')?.enable();
      this.moduleModels=resp; 
    })
  }

}
