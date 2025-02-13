import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservedParametersComponent } from './observed-parameters.component';

describe('ObservedParametersComponent', () => {
  let component: ObservedParametersComponent;
  let fixture: ComponentFixture<ObservedParametersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ObservedParametersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ObservedParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
