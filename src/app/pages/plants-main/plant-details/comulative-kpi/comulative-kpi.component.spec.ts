import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComulativeKpiComponent } from './comulative-kpi.component';

describe('ComulativeKpiComponent', () => {
  let component: ComulativeKpiComponent;
  let fixture: ComponentFixture<ComulativeKpiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComulativeKpiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComulativeKpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
