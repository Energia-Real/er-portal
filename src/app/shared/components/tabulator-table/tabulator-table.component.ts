import { Component, Input, OnInit } from '@angular/core';
import { ColumnDefinition, Tabulator } from 'tabulator-tables';


@Component({
  selector: 'app-tabulator-table',
  templateUrl: './tabulator-table.component.html',
  styleUrl: './tabulator-table.component.scss'
})

export class TabulatorTableComponent implements OnInit {


  table_def = [
    { title: 'Id', field: 'id' },
    { title: 'First Name', field: 'firstName' },
    { title: 'Last Name', field: 'lastName' },
    { title: 'Location', field: 'state' },
  ];
  @Input() columns: ColumnDefinition[] = [];
  @Input() data: any[] = [];
  @Input() height: number = 140;
  tab = document.createElement('div');
  exTable: any;


  constructor() {
    
  }

  ngOnInit(){
    this.exTable = new Tabulator("#general-table-div", {
      height: this.height,
      layout: 'fitColumns',
      columns: this.columns,
      movableColumns: true,
      data: this.data,
    });
  }
}
