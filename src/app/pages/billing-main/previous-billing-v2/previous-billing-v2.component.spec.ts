import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousBillingV2Component } from './previous-billing-v2.component';

describe('PreviousBillingV2Component', () => {
  let component: PreviousBillingV2Component;
  let fixture: ComponentFixture<PreviousBillingV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreviousBillingV2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreviousBillingV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
