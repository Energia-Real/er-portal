import { Component, OnInit, ViewChild } from '@angular/core';
import { LegalsService } from '../legals.service';
import { GeneralResponse } from '@app/shared/models/general-models';
import { Cat, CatQyA, CatsListResponse, Question, QyAListResponse,QyADataModal } from '../legals.models';
import { MatPaginator } from '@angular/material/paginator';
import { CatalogsService } from '@app/shared/services/catalogs.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { AddQyaComponent } from '../add-qya/add-qya.component';

@Component({
  selector: 'app-admin-qya',
  templateUrl: './admin-qya.component.html',
  styleUrl: './admin-qya.component.scss'
})
export class AdminQyaComponent implements OnInit{

  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  selectedCat: string = "ALL";
  cats!:Cat[];
  QyAsEN!:CatQyA[];
  QyAsES!:CatQyA[];
  QyAsSelectedES!:Question[]|undefined;
  QyAsSelectedEN!:Question[]|undefined;

  dataSourceES = new MatTableDataSource<any>([]);
  dataSourceEN = new MatTableDataSource<any>([]);

  activeTabIndex = 0;

  displayedColumns: string[] = [
    'question',
    'category',
    'actions',
  ];


  QyAs!:CatQyA[];

  LenSel: "ES"| "EN" = "ES"


  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  constructor(
    private moduleService: LegalsService,
    public dialog: MatDialog
  ){

  }

  ngOnInit(): void {
    this.getCats()
    this.fetchQyas()
  }

  getCats(){
    this.moduleService.getCats().subscribe({
      next:(response: GeneralResponse<CatsListResponse>) =>{
        this.cats = response.response.cats
        this.cats.push({catCode:"ALL",enDesc:"All", esDesc:"Todo"})
      }
    }
      
    )
  }

  changePageSize(event: any) {
    const newSize = event.value;
    this.pageSize = newSize;

    if (this.paginator) {
      this.paginator.pageSize = newSize;
      this.paginator._changePageSize(newSize);
    }

  }

  fetchQyas(){
      this.moduleService.getQyas().subscribe({
        next:(response: GeneralResponse<QyAListResponse>)=>{
          this.QyAsES = response.response.cats.filter(cat => cat.lenguage=="ES");
          this.QyAsEN = response.response.cats.filter(cat => cat.lenguage=="EN");
          this.QyAsSelectedES = this.filterByCat(this.QyAsES,this.selectedCat)
          this.QyAsSelectedEN = this.filterByCat(this.QyAsEN,this.selectedCat)
          console.log(this.QyAsSelectedES )
          console.log(this.QyAsSelectedEN )

          this.reselectDataSources()
        },
        error: (error) => {
          /* let errorArray = error!.error!.errors!.errors!;
          if(errorArray.length == 1){
            this.createNotificationError(this.ERROR, errorArray[0].title,errorArray[0].descripcion,errorArray[0].warn)
            } */
        }
      })
    }

  

    filterByCat(qyas: CatQyA[], cat: string): Question[] {
      if (cat === "ALL") {
          return qyas.flatMap(qya => 
              qya.questions.map(question => ({
                  ...question,
                  cat: qya.desc // Agrega la propiedad cat con el valor de qya.desc
              }))
          );
      }
  
      const filteredQya = qyas.find(qya => qya.catCode === cat);
      
      if (!filteredQya) return []; // Si no se encuentra, devuelve un array vacío
  
      return filteredQya.questions.map(question => ({
          ...question,
          cat: filteredQya.desc // Agrega la propiedad cat con el valor de desc
      }));
  }


  reselectDataSources(){
    this.dataSourceES.data = this.QyAsSelectedES!;
    this.dataSourceEN.data = this.QyAsSelectedEN!;
  }

  onCategoryChange(event: any): void {
    const selectedValue = event.value;
    this.selectedCat = event.value
    this.QyAsSelectedES = this.filterByCat(this.QyAsES, event.value)
    this.QyAsSelectedEN = this.filterByCat(this.QyAsEN, event.value)
    console.log(this.QyAsSelectedES)
    console.log(this.QyAsSelectedEN)
    this.reselectDataSources()
  }

  actionButton(action:string){
    if(action == "add"){

      let modalData: QyADataModal = {
        lenguage: this.activeTabIndex === 0 ? "ES" : "EN",
        editMode: false
      }
      this.addQya(modalData)

    }
  }

  addQya(dataModal?:QyADataModal){
    const dialogRef = this.dialog.open(AddQyaComponent, {
          width: '564px',     
          data: dataModal!
        });
    dialogRef.afterClosed().subscribe(() => {
        this.fetchQyas()
      });
  }

}
