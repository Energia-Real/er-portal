import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnergyProdUpdateComponent } from './energy-prod-update.component';

describe('EnergyProdUpdateComponent', () => {
  let component: EnergyProdUpdateComponent;
  let fixture: ComponentFixture<EnergyProdUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnergyProdUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EnergyProdUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
