import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPlantComponent } from './new-plant.component';

describe('NewPlantComponent', () => {
  let component: NewPlantComponent;
  let fixture: ComponentFixture<NewPlantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewPlantComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewPlantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
