import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingAdjustmentsComponent } from './billing-adjustments.component';

describe('BillingAdjustmentsComponent', () => {
  let component: BillingAdjustmentsComponent;
  let fixture: ComponentFixture<BillingAdjustmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BillingAdjustmentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BillingAdjustmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
