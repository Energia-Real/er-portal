import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentBillingComponent } from './current-billing.component';

describe('CurrentBillingComponent', () => {
  let component: CurrentBillingComponent;
  let fixture: ComponentFixture<CurrentBillingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CurrentBillingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CurrentBillingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
