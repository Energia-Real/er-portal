import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InverterComponent } from './inverter.component';

describe('InverterComponent', () => {
  let component: InverterComponent;
  let fixture: ComponentFixture<InverterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InverterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
