import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Cat, CatsListResponse, QyADataModal } from '../legals.models';
import { FormBuilder, Validators } from '@angular/forms';
import { LegalsService } from '../legals.service';
import { EditNotificationStatus, GeneralResponse, notificationData, NotificationMessages, NotificationServiceData } from '@app/shared/models/general-models';
import { NotificationDataService } from '@app/shared/services/notificationData.service';
import { NOTIFICATION_CONSTANTS } from '@app/core/constants/notification-constants';
import { EncryptionService } from '@app/shared/services/encryption.service';
import { NotificationService } from '@app/shared/services/notification.service';
import { NotificationComponent } from '@app/shared/components/notification/notification.component';

@Component({
    selector: 'app-add-qya',
    templateUrl: './add-qya.component.html',
    styleUrl: './add-qya.component.scss',
    standalone: false
})
export class AddQyaComponent implements OnInit {

  ADD=NOTIFICATION_CONSTANTS.ADD_CONFIRM_TYPE;
  CANCEL=NOTIFICATION_CONSTANTS.CANCEL_TYPE;
  EDIT=NOTIFICATION_CONSTANTS.EDIT_CONFIRM_TYPE;
  DELETE=NOTIFICATION_CONSTANTS.DELETE;
  ERROR = NOTIFICATION_CONSTANTS.ERROR_TYPE;

  formData = this.fb.group({
      question: ['', Validators.required],
      answer: ['', Validators.required],
      catCode: ['', Validators.maxLength(4)],
    });

  categories:Cat[]=[];
  private notificationId?: string;


  constructor(
    public dialogRef: MatDialogRef<AddQyaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: QyADataModal,
    private fb: FormBuilder,
    private moduleService: LegalsService,
    private notificationDataService: NotificationDataService,
    private encryptionService: EncryptionService,
    private notificationsService: NotificationService,
    public dialog: MatDialog,
  ){

  }

  ngOnInit(): void {
    this.fetchCats()
  }

  fetchCats(){
    this.moduleService.getCats().subscribe({
      next:(response:GeneralResponse<CatsListResponse>)=>{
        this.categories= response.response.cats
        this.formData.controls['catCode'].setValue(this.categories.length > 0 ? this.categories[0].catCode : null);

      },
      error:(error)=>{

      }
    })
  }

  actionButton(){
    if(!this.data.editMode){
      this.createNotificationModal(this.ADD)
    }
  }

  saveDataPost(notificationmessages:NotificationMessages) {
    let objData: any = {lenguage: this.data.lenguage, ...this.formData.value }
    console.log(objData)
    this.moduleService.postDataQya(objData,notificationmessages).subscribe({
      next:() =>{

      },
      error: (error) => {
        /* let errorArray = error.error.errors.errors;
        if(errorArray.length == 1){
          this.createNotificationError(this.ERROR, errorArray[0].title,errorArray[0].descripcion,errorArray[0].warn)
          } */
      }
    })
  }
  
  closeDrawer() {
    this.formData.reset()
    this.dialogRef.close()
  }  

  createNotificationModal(notificationType:string){
    const encryptedData = localStorage.getItem('userInfo');
    if(encryptedData){
      const userInfo = this.encryptionService.decryptData(encryptedData);
      const dataNotificationModal:notificationData|undefined = this.notificationDataService.qyaNotificationData(notificationType);
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
                completedTitleSnack:NOTIFICATION_CONSTANTS.ADD_QYA_COMPLETE_TITLE,
                completedContentSnack:NOTIFICATION_CONSTANTS.ADD_QYA_COMPLETE_CONTENT,
                notificationId:this.notificationId,
                successCenterMessage:NOTIFICATION_CONSTANTS.ADD_QYA_SUCCESS,
                errorCenterMessage:NOTIFICATION_CONSTANTS.ADD_QYA_ERROR,
                userId:userInfo.id
              }
              this.saveDataPost(snackMessagesAdd);
              this.closeDrawer()
              return;
            /* case this.EDIT:
              let snackMessagesEdit:NotificationMessages = {
                completedTitleSnack:NOTIFICATION_CONSTANTS.EDIT_CLIENT_COMPLETE_TITLE,
                completedContentSnack:NOTIFICATION_CONSTANTS.EDIT_CLIENT_COMPLETE_CONTENT,
                errorTitleSnack:'',
                errorContentSnack:'',
                notificationId:this.notificationId,
                successCenterMessage:NOTIFICATION_CONSTANTS.EDIT_CLIENT_SUCCESS,
                errorCenterMessage:NOTIFICATION_CONSTANTS.EDIT_CLIENT_ERROR,
                userId:this.user.id
              }
              this.saveDataPatch(snackMessagesEdit)
              this.closeDrawer(true)
              return; */
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
  

}
