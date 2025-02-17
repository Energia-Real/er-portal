import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SitePerformanceComponent } from './site-performance.component';

describe('SitePerformanceComponent', () => {
  let component: SitePerformanceComponent;
  let fixture: ComponentFixture<SitePerformanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SitePerformanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SitePerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
