import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { selectClientName, selectCorporateClient } from '@app/core/store/selectors/drawer.selector';
import { Store } from '@ngrx/store';
import { Subject, Subscription } from 'rxjs';
import { ClientsService } from '../clients.service';
import { corporate, corporatePlant, DataCorporateResponse, DataPostRazonSocial, PlantWhitoutCorporate } from '../clients-model';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NOTIFICATION_CONSTANTS } from '@app/core/constants/notification-constants';
import { EditNotificationStatus, notificationData, NotificationMessages, NotificationServiceData } from '@app/shared/models/general-models';
import { NotificationService } from '@app/shared/services/notification.service';
import { NotificationDataService } from '@app/shared/services/notificationData.service';
import { EncryptionService } from '@app/shared/services/encryption.service';
import { MatDialog } from '@angular/material/dialog';
import { NotificationComponent } from '@app/shared/components/notification/notification.component';

@Component({
  selector: 'app-corporate-names',
  templateUrl: './corporate-names.component.html',
  styleUrl: './corporate-names.component.scss'
})
export class CorporateNamesComponent implements OnInit, OnDestroy {
  @Input() isOpen = false;
  @Input() clientId:string|null = null;

  @Output() closeDrawerEmmit = new EventEmitter<boolean>();
  private onDestroy$ = new Subject<void>();
  private notificationId?: string;


  ADD=NOTIFICATION_CONSTANTS.ADD_CONFIRM_TYPE;
  CANCEL=NOTIFICATION_CONSTANTS.CANCEL_TYPE;
  EDIT=NOTIFICATION_CONSTANTS.EDIT_CONFIRM_TYPE;
  DELETE=NOTIFICATION_CONSTANTS.DELETE;
  ERROR = NOTIFICATION_CONSTANTS.ERROR_TYPE;

  drawerClientSub: Subscription;
  clientNameSub: Subscription;
  corporateData!: DataCorporateResponse;
  clientName!: string;
  editMode = false;
  isMainExpanded = false;
  selectedPlants: any[] = [];
  isEditing = false; 

  formData = this.fb.group({
    inputCorporateName: ['', Validators.required],
    rfc: ['', Validators.required],

      plant: ['', Validators.required]
    });

  corporatesEdited:corporate[]=[]
  
  plants:PlantWhitoutCorporate[]= [
  ]

  plantsFijo:PlantWhitoutCorporate[]= [
  ]

  constructor(
    private store: Store, 
    private moduleServices: ClientsService, 
    private fb: FormBuilder,
    private notificationsService: NotificationService,
    private notificationDataService: NotificationDataService,
    private encryptionService: EncryptionService,
    public dialog: MatDialog,
    
    
  ){
    this.drawerClientSub = this.store.select(selectCorporateClient).subscribe(resp =>{
      this.getCorporateData(resp!)
    })

    this.clientNameSub = this.store.select(selectClientName).subscribe(resp =>{
      this.clientName = resp!
    })
  }

  ngOnInit() {
    this.getPlantsWithoutRS()
  }

  closeDrawer() {
    this.isOpen = false;
    this.editMode=false;
    this.closeDrawerEmmit.emit(false)
    this.isEditing = false
    if(this.editMode){
      this.changeEditMode()
    }
    setTimeout(() => this.cancelEdit(), 300);
    //this.store.dispatch(updateDrawer({ drawerOpen: false, drawerAction: "Create", drawerInfo: null, needReload: reload }));
  }

  getCorporateData(clientId: string){
   if(clientId!=null){
    this.clientId = clientId;
    this.moduleServices.getCorporates(clientId).subscribe(resp =>{
      this.corporateData = resp.response
    })
   }
    
  }
  
  changeEditMode(){
    this.editMode = !this.editMode;
    if(this.isMainExpanded){
      this.toggleHeight();
    }
  }

  toggleHeight() {
    this.isMainExpanded = !this.isMainExpanded;
  }
  

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.unsubscribe();
  }

  cancelEdit() {
    this.formData.reset();
    this.formData.markAsPristine();
    this.formData.markAsUntouched();
    for(let plant of this.selectedPlants){//restaura los array de plants
      this.removePlant(plant)
    }
  }

  addArrayPlant(planta:any){
    this.selectedPlants.push(planta)
    const index = this.plants.findIndex(item => item.externalId === planta.externalId);
      if (index !== -1) {
        this.plants.splice(index, 1);
      }
    console.log( this.selectedPlants)
  }

  createEditJson(razonSocial:corporate, plant:PlantWhitoutCorporate){
    this.isEditing=true;
    
      const corporateIndex = this.corporatesEdited.findIndex(item => item.id === razonSocial.id);
      if (corporateIndex == -1) {
        this.corporatesEdited.push(razonSocial);
        console.log(this.corporatesEdited)

      }
      let plantWithCorporate: corporatePlant = {//ya que corporatePlant y plantWithoutCorporate son diferentes objetos por regla de negocio debemos hacer un tipo casteo
        id:plant.internalId,
        externalId: plant.externalId,
        plantName:plant.siteName
      }

      let corporateDataIndex = this.corporateData.data.findIndex(item => item.id === razonSocial.id);
      this.corporateData.data[corporateDataIndex].plants.push(plantWithCorporate)

      const index = this.plants.findIndex(item => item.externalId === plant.externalId);//se elimina la planta del dropdown
      if (index !== -1) {
        this.plants.splice(index, 1);
      }

      console.log(this.corporatesEdited)
      console.log(this.corporateData.data)
    
  }

  getPlantsWithoutRS(){
    this.moduleServices.getPlantsWithoutCorporate().subscribe(resp =>{
      this.plants = resp.response.projects
      this.plantsFijo = resp.response.projects
    })
  }

  removePlant(planta: any, razonSocial?:corporate){
   if(!razonSocial){
    this.plants.push(planta);
    const index = this.selectedPlants.findIndex(item => item.externalId === planta.externalId);
      if (index !== -1) {
        this.selectedPlants.splice(index, 1);
      }
   }else{
    let plantWithoutCorporate: PlantWhitoutCorporate = {//ya que corporatePlant y plantWithoutCorporate son diferentes objetos por regla de negocio debemos hacer un tipo casteo
      internalId:planta.id,
      externalId: planta.externalId,
      siteName:planta.plantName
    }
    this.plants.push(plantWithoutCorporate)

    let corporateDataIndex = this.corporateData.data.findIndex(item => item.id === razonSocial.id);

    const index = this.corporateData.data[corporateDataIndex].plants.findIndex(item => item.externalId === planta.externalId);//se elimina la planta del dropdown
      if (index !== -1) {
        this.corporateData.data[corporateDataIndex].plants.splice(index, 1);
      }
      console.log(this.corporatesEdited)
   }
  }

  actionSave(){
    if(this.isMainExpanded){
     this.createNotificationModal(this.ADD)
    }

    if(!this.isMainExpanded && this.isEditing){
      this.createNotificationModal(this.EDIT)
    }
  }


  saveDataPost(notificationmessages:NotificationMessages){
    const corporateName = this.formData.get('inputCorporateName')?.value;
    const rfc = this.formData.get('rfc')?.value;

    const plantIds: string[] = this.selectedPlants.map(plant => plant.externalId);
    console.log(plantIds)
    let req:DataPostRazonSocial= {
      corporateName:corporateName!,
      plantsIds:plantIds,
      rfc: rfc!
    }
    let reqArray=[req];
    console.log(this.clientId)

    this.moduleServices.postRazonSocial(reqArray,this.clientId!,notificationmessages).subscribe({
     next:()=>{
      this.changeEditMode();
     },
     error:(error) => {
      let errorArray = error.error.errors.errors;
      if(errorArray.length == 1){
        this.createNotificationError(this.ERROR, errorArray[0].title,errorArray[0].descripcion,errorArray[0].warn)
        }
    }
    })

  }

  saveDataPatch(notificationmessages:NotificationMessages){

    const transformedArray = this.corporatesEdited.map(item => ({
      id: item.id,
      internalClientId: item.internalClientId,
      corporateName: item.corporateName,
      rfc: item.rfc,
      plants: item.plants.map(plant => plant.externalId)
    }));

    this.moduleServices.patchRazonSocial(transformedArray,this.clientId!,notificationmessages).subscribe({
      next:()=>{
       this.changeEditMode();
      },
      error:(error) => {
       let errorArray = error.error.errors.errors;
       if(errorArray.length == 1){
         this.createNotificationError(this.ERROR, errorArray[0].title,errorArray[0].descripcion,errorArray[0].warn)
         }
     }
     })
    
    console.log(transformedArray);


  }

  createNotificationModal(notificationType:string){
      const dataNotificationModal:notificationData|undefined = this.notificationDataService.corporateNotificationData(notificationType);
      const encryptedData = localStorage.getItem('userInfo');
      if (encryptedData) {
        const userInfo = this.encryptionService.decryptData(encryptedData);
        const dataNotificationService:NotificationServiceData= {
          userId:userInfo.id,
          descripcion:dataNotificationModal?.title,
          notificationTypeId:dataNotificationModal?.typeId,
          notificationStatusId:this.notificationsService.getNotificationStatusByName(NOTIFICATION_CONSTANTS.INPROGRESS_STATUS).id
        } 
        this.notificationsService.createNotification(dataNotificationService).subscribe(res=>{
          this.notificationId=res.response.externalId;
        })

        const dialogRef = this.dialog.open(NotificationComponent, {
          width: '540px',     
          data: dataNotificationModal
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result && result.confirmed && this.notificationId) {
            switch(result.action){
              case this.ADD:
                let snackMessagesAdd:NotificationMessages = {
                  completedTitleSnack:NOTIFICATION_CONSTANTS.ADD_CORPORATE_NAME_COMPLETE_TITLE,
                  completedContentSnack:NOTIFICATION_CONSTANTS.ADD_CORPORATE_NAME_COMPLETE_CONTENT,
                  errorTitleSnack:'',
                  errorContentSnack:'',
                  notificationId:this.notificationId,
                  successCenterMessage:NOTIFICATION_CONSTANTS.ADD_CORPORATE_SUCCESS,
                  errorCenterMessage:NOTIFICATION_CONSTANTS.ADD_GENERAL_ERROR,
                  userId:userInfo.id
                }
                this.saveDataPost(snackMessagesAdd);
                this.closeDrawer()
                return;
              case this.EDIT:
                let snackMessagesEdit:NotificationMessages = {
                  completedTitleSnack:NOTIFICATION_CONSTANTS.EDIT_CLIENT_COMPLETE_TITLE,
                  completedContentSnack:NOTIFICATION_CONSTANTS.EDIT_CLIENT_COMPLETE_CONTENT,
               
                  notificationId:this.notificationId,
                  successCenterMessage:NOTIFICATION_CONSTANTS.EDIT_CORPORATE_SUCCESS,
                  errorCenterMessage:NOTIFICATION_CONSTANTS.EDIT_GENERAL_ERROR,
                  userId:userInfo.id
                }
                this.closeDrawer()
                this.saveDataPatch(snackMessagesEdit)

                return;
              case this.CANCEL: 
                let editStatusData={
                  externalId: this.notificationId,
                  status: this.notificationsService.getNotificationStatusByName(NOTIFICATION_CONSTANTS.COMPLETED_STATUS).id
                }
                this.notificationsService.updateNotification(editStatusData).subscribe(res=>{})
                this.closeDrawer()
                return 
            }
          } else {
            if(this.notificationId){
              const editStatusData:EditNotificationStatus={
                externalId: this.notificationId,
                status: this.notificationsService.getNotificationStatusByName(NOTIFICATION_CONSTANTS.CANCELED_STATUS).id
              }
              this.notificationsService.updateNotification(editStatusData).subscribe(res=>{})
            }
          }    
        });

      }
      
    }


    createNotificationError(notificationType:string, title?:string, description?: string, warn?:string ){
      const dataNotificationModal:notificationData|undefined = this.notificationDataService.uniqueError();
      dataNotificationModal!.title= title;
      dataNotificationModal!.content = description;
      dataNotificationModal!.warn = warn; // ESTOS PARAMETROS SE IGUALAN AQUI DEBIDO A QUE DEPENDEN DE LA RESPUESTA DEL ENDPOINT
      const encryptedData = localStorage.getItem('userInfo');
      if (encryptedData) {
        const userInfo = this.encryptionService.decryptData(encryptedData);
        let dataNotificationService:NotificationServiceData= { //INFORMACION NECESARIA PARA DAR DE ALTA UNA NOTIFICACION EN SISTEMA
          userId:userInfo.id,
          descripcion:description,
          notificationTypeId:dataNotificationModal?.typeId,
          notificationStatusId:this.notificationsService.getNotificationStatusByName(NOTIFICATION_CONSTANTS.COMPLETED_STATUS).id //EL STATUS ES COMPLETED DEBIDO A QUE EN UN ERROR NO ESPERAMOS UNA CONFIRMACION O CANCELACION(COMO PUEDE SER EN UN ADD, EDIT O DELETE)
        } 
        this.notificationsService.createNotification(dataNotificationService).subscribe(res=>{
        })
      }
  
      
  
      const dialogRef = this.dialog.open(NotificationComponent, {
        width: '540px',     
        data: dataNotificationModal
      });
  
    }
  

}
