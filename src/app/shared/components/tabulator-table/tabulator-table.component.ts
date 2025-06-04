import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ColumnDefinition, Options, TabulatorFull as Tabulator } from 'tabulator-tables';


@Component({
  selector: 'app-tabulator-table',
  templateUrl: './tabulator-table.component.html',
  styleUrl: './tabulator-table.component.scss',
  standalone: false
})

export class TabulatorTableComponent implements OnInit, OnChanges, AfterViewInit {
  table_def = [
    { title: 'Id', field: 'id' },
    { title: 'First Name', field: 'firstName' },
    { title: 'Last Name', field: 'lastName' },
    { title: 'Location', field: 'state' },
  ];
  @ViewChild('tableDiv', { static: false }) tableDiv!: ElementRef;

  @Input() data: any[] = [];
  @Input() config!: Options;
  
  tab = document.createElement('div');
  exTable: any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      if (this.exTable) {
        this.exTable.replaceData(this.data);
      }
    }
    
    if (changes['config'] && !changes['config'].firstChange && this.exTable) {
      // If the config changes (e.g., columns are updated), update the table
      this.updateColumns();
    }
  }

  constructor() {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.config.data = this.data; 
    this.exTable = new Tabulator(this.tableDiv.nativeElement, this.config);
  }

  /**
   * Updates the columns of the table
   * This is useful when the language changes and column titles need to be updated
   */
  updateColumns() {
    if (this.exTable && this.config && this.config.columns) {
      this.exTable.setColumns(this.config.columns);
      this.exTable.redraw(true);
    }
  }

  /**
   * Recreates the table with the new configuration
   * This is a more drastic approach that recreates the entire table
   */
  recreateTable() {
    if (this.exTable) {
      this.exTable.destroy();
      this.config.data = this.data;
      this.exTable = new Tabulator(this.tableDiv.nativeElement, this.config);
    }
  }

  download(type: string) {
    switch (type) {
      case 'csv':
        this.exTable.download('csv', 'data.csv');
        break;
      case 'json':
        this.exTable.download('json', 'data.json');
        break;
      case 'xlsx':
        this.exTable.download('xlsx', 'data.xlsx', { sheetName: 'My Data' });
        break;
      case 'pdf':
        this.exTable.download('pdf', 'data.pdf', {
          orientation: 'portrait',
          title: 'Example Report',
        });
        break;
      case 'html':
        this.exTable.download('html', 'data.html', { style: true });
        break;
    }
  }
}
