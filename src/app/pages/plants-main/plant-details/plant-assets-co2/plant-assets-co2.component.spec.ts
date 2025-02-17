import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantAssetsCo2Component } from './plant-assets-co2.component';

describe('PlantAssetsCo2Component', () => {
  let component: PlantAssetsCo2Component;
  let fixture: ComponentFixture<PlantAssetsCo2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlantAssetsCo2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlantAssetsCo2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
