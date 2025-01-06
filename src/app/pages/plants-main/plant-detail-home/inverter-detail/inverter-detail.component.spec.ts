import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InverterDetailComponent } from './inverter-detail.component';

describe('InverterDetailComponent', () => {
  let component: InverterDetailComponent;
  let fixture: ComponentFixture<InverterDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InverterDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InverterDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
