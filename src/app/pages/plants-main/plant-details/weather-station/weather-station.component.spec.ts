import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherStationComponent } from './weather-station.component';

describe('WeatherStationComponent', () => {
  let component: WeatherStationComponent;
  let fixture: ComponentFixture<WeatherStationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WeatherStationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WeatherStationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
