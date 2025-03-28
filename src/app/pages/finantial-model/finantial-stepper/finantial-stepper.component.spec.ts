import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinantialStepperComponent } from './finantial-stepper.component';

describe('FinantialStepperComponent', () => {
  let component: FinantialStepperComponent;
  let fixture: ComponentFixture<FinantialStepperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinantialStepperComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FinantialStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
