import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FinantialStepperComponent } from '../finantial-stepper/finantial-stepper.component';
import { FinantialDataModelStepper } from '../finantial-model-model';
import { FinantialService } from '../finantial.service';

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
    public dialog: MatDialog,
    private moduleService: FinantialService
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

  donwloadTemplate(){
    this.moduleService.downloadTemplate().subscribe({
      next:(resp:Blob)=>{
        const url = window.URL.createObjectURL(resp);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'FinantialModelTemplate.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      },
      error: (err) => {
        console.error('Error al descargar la plantilla', err);
      }
    })
  }

  getInformation(){
    this.moduleService.exportInformation(this.fileId!).subscribe({
      next:(excel:Blob) => {
        const url = window.URL.createObjectURL(excel);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'FinantialModelTemplate.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();     
      },
      error: (err) => {
        console.error('Error al descargar excel', err);
      }
    })
  }

  deleteScenarios(){
    this.moduleService.deleteFile(this.fileId!).subscribe({
      next:(resp: any) => {
        console.log("Scenarios deleted")  
      },
      error: (err) => {
        console.error('Error al borrar escenarios', err);
      }
    })
  }

}
