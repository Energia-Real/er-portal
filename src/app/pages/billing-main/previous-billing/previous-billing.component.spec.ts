import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousBillingComponent } from './previous-billing.component';

describe('PreviousBillingComponent', () => {
  let component: PreviousBillingComponent;
  let fixture: ComponentFixture<PreviousBillingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreviousBillingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreviousBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
