import { Component, OnInit } from '@angular/core';
import { ConfigGlobalFilters } from '@app/shared/components/global-filters/global-filters-model';

@Component({
  selector: 'app-home-back-office',
  templateUrl: './home-back-office.component.html',
  styleUrl: './home-back-office.component.scss',
  standalone: false
})
export class HomeBackOfficeComponent implements OnInit {

  ngOnInit(): void {
  }

  onFiltersChanged(filters: any) {
    console.log('Filtros aplicados', filters);
  }
}
