import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FinantialStepperComponent } from '../finantial-stepper/finantial-stepper.component';
import { FinantialDataModelStepper } from '../finantial-model-model';

@Component({
  selector: 'app-finantial-model-layout',
  templateUrl: './finantial-model-layout.component.html',
  styleUrl: './finantial-model-layout.component.scss'
})
export class FinantialModelLayoutComponent  implements OnInit{
  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFile: File | null = null;
  processStatus:string|null = null;
  scenarios:number|null =null;
  fileId:string | null = null;
  constructor(
      public dialog: MatDialog
    
  ){

  }

  ngOnInit(): void {
    
  }
  openFileSelector() {
    this.fileInput.nativeElement.click(); 
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0]; 
    }
    this.openValidation()
  }

  openValidation(){
    let dataModal : FinantialDataModelStepper = {file:this.selectedFile};
    this.scenarios = null;
    this.processStatus = null;
    this.fileId = null;
    const dialogRef = this.dialog.open(FinantialStepperComponent, {
              disableClose: true ,
              width: '564px',
              data: dataModal!
            });
        dialogRef.afterClosed().subscribe(result => {
              console.log(result)
              if(result.status){
                this.processStatus = result.status
              }
              if(result.scenarios){
                this.scenarios = result.scenarios
              }
              if(result.fileId){
                this.fileId = result.fileId
              }
              this.selectedFile = null;  
          });
  }
}
