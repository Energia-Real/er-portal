import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyProductionComponent } from './energy-production.component';

describe('EnergyProductionComponent', () => {
  let component: EnergyProductionComponent;
  let fixture: ComponentFixture<EnergyProductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnergyProductionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnergyProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
