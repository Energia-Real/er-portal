import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as L from 'leaflet';
import geojson from '../../../../assets/geojsons/mexicoHigh.json'; // Ajusta la ruta a tu archivo GeoJSON
import { GeoJsonObject } from 'geojson';
import { setFilters, setFiltersBatu, setFiltersSolarCoverage } from '@app/core/store/actions/filters.actions';
import { Store } from '@ngrx/store';
import { FilterState } from '@app/shared/models/general-models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent  {

  @Output() refresh = new EventEmitter<string[]>();

  selectedStates: string[] = [];
  filters$!: Observable<FilterState['filters']>;
  filters!: FilterState['filters'];

  constructor(
    private store: Store<{ filters: FilterState }>

  ){
    this.filters$ = this.store.select(state => state.filters.filters);
    this.filters$.subscribe(filters => {this.filters=filters });
  }

  isSelected(stateId: string): boolean {
    return this.selectedStates.includes(stateId);
  }

  onPolygonClick(stateId: string): void {
    const index = this.selectedStates.indexOf(stateId);
    if (index === -1) {
      this.selectedStates.push(stateId);
      let filters = { 
        ...this.filters, 
        states: [...this.selectedStates] 
      };
      console.log(filters)
      this.store.dispatch(setFilters({ filters }));

    } else {
      this.selectedStates.splice(index, 1);
      let filters = { 
        ...this.filters, 
        states: [...this.selectedStates] 
      };
      console.log(filters)
      this.store.dispatch(setFilters({ filters }));    }
  }
}
