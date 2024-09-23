import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingMainComponent } from './billing-main.component';

describe('BillingMainComponent', () => {
  let component: BillingMainComponent;
  let fixture: ComponentFixture<BillingMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BillingMainComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BillingMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
