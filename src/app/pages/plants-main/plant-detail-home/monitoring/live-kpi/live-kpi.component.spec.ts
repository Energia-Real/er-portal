import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveKpiComponent } from './live-kpi.component';

describe('LiveKpiComponent', () => {
  let component: LiveKpiComponent;
  let fixture: ComponentFixture<LiveKpiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LiveKpiComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LiveKpiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
