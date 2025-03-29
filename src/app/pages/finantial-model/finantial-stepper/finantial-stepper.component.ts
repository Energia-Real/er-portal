import { Component, ElementRef, ViewChild, AfterViewInit, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FinantialDataModelStepper, ProcessType, StatusType, WebSocketResponse } from '../finantial-model-model';
import { FinantialService } from '../finantial.service';
import { NotificationMessages } from '@app/shared/models/general-models';
import { NOTIFICATION_CONSTANTS } from '@app/core/constants/notification-constants';
import anime from 'animejs';
import { MatStepper } from '@angular/material/stepper';

type StepState = "Initial" | "Disabled"| "Loading" | "Success" | "Error";



@Component({
  selector: 'app-finantial-stepper',
  templateUrl: './finantial-stepper.component.html',
  styleUrls: ['./finantial-stepper.component.scss']
})
export class FinantialStepperComponent implements OnInit {

  
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('stepper') private stepper!: MatStepper;

  isModalOpen = false;
  fileOpened = false; // Para detectar si el input fue abierto

  fileId!:string;

  uploadState:StepState = "Initial";
  validationState:StepState = "Disabled"
  executionState:StepState = "Disabled"
  resultState:StepState = "Disabled"

  executeMessagesCount = 0;
  executeTotalExpected = 0; 
  executeHasError = false;
  executeTotalScenarios = 0;
  executeScenariosReceived = 0;
  loading = true;
  processStatus:StepState="Loading";
  errors!:any[];
  

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: FinantialDataModelStepper,
    private moduleService: FinantialService,
    private cdRef: ChangeDetectorRef,
    public dialogRef: MatDialogRef<FinantialStepperComponent>,
  ){
    this.postFile(this.data.file!)
  }
  ngOnInit(): void {

  }


  siguientePaso() {
    this.stepper.next();
  }

  postFile(selectedFile:File){
    this.uploadState= "Loading"
    let snackMessagesAdd:NotificationMessages = {
                    completedTitleSnack:NOTIFICATION_CONSTANTS.CONFIRM_ADD_FILE_TITLE,
                    completedContentSnack:NOTIFICATION_CONSTANTS.CONFIRM_ADD_FILE_CONTENT,
                  }
    this.moduleService.postCsv(selectedFile, snackMessagesAdd).subscribe({
      next:(resp:any)=>{
        this.fileId = resp.id
        this.uploadState="Success"
        this.siguientePaso()
        this.initValidation(resp.id)
      },
      error:(errors:any) =>{
        this.processStatus = "Error";
      }
    })
  }

  initValidation(fileId:string){
    this.moduleService.getMessages().subscribe({
      next: (response:WebSocketResponse) => {
        this.updateStates(response);
      },
      error: (err) => {
        console.error("Error en WebSocket ❌", err);
        this.processStatus = "Error";
      }
    });
    this.startRequest(fileId);

  }

  startRequest(fileId:string) {
    //this.uploadState = "Loading";
    this.moduleService.sendMessage("start", fileId);
  }
    

  private updateStates(response: WebSocketResponse): void {
    const { process, status } = response;
    if(response.errors.length>0){
      this.errors=response.errors
      this.processStatus ="Error"
    }
    switch (process) {
      case 'validate':
        this.validationState = this.getStateFromStatus(status);
        if(this.validationState=="Success")
          this.siguientePaso()
        else {
         // this.processStatus = "Error";
        }        

        this.cdRef.detectChanges();
        break;
        
      case 'execute':
        this.handleExecuteMessages(response);
        break;
        
      case 'result':
        this.handleResultMessage(response);
        break;
    }
  }
  
  private handleExecuteMessages(response: WebSocketResponse): void {
    const { status, scenario } = response;
  
    // Mensaje inicial de execute
    if (status === 'start') {
      this.executionState = 'Loading';
      this.cdRef.detectChanges();

      this.executeScenariosReceived = 0;
      this.executeHasError = false;
      return;
    }
  
    // Mensajes de progreso (success/error por escenario)
    this.executeScenariosReceived++;
    
    if (status === 'error') {
      this.executeHasError = true;
    }
  }
  
  private handleResultMessage(response: WebSocketResponse): void {
    // Cuando llega el mensaje final (result)
    this.executeTotalScenarios = response.scenarios || 0;
    
    // Verificar si todos los escenarios se procesaron
    if (this.executeScenariosReceived >= this.executeTotalScenarios) {
      this.executionState = this.executeHasError ? 'Error' : 'Success';
      console.log(this.executionState)
      if(this.executionState=="Success")
        this.siguientePaso()
      else
        {
          this.processStatus = "Error";
        }

      this.cdRef.detectChanges();

      this.resultState = this.getStateFromStatus(response.status);
      if(this.resultState=="Success"){
        this.siguientePaso()
        this.processStatus = "Success"
      }
      else {
        this.processStatus = "Error";

      }

      this.cdRef.detectChanges();

    } else {
      console.warn('Faltan escenarios por procesar');
      this.executionState = 'Error';
    }
  }
  
  private getStateFromStatus(status: 'start' | 'success' | 'error'): StepState {
    if(status=="error"){
      this.processStatus = "Error";

    }
    return status === 'start' ? 'Loading' : 
           status === 'success' ? 'Success' : 'Error';
  }

  completeProccess(){
    this.closeDrawer({status:"Success", scenarios:this.executeTotalScenarios, fileId: this.fileId})

  }

  cancelProccess(){
    this.closeDrawer({status:"Error"})
  }

  closeDrawer(data?:any){
    this.dialogRef.close(data)
    this.moduleService.closeConnection();
  }

}
