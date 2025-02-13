import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantsEvenetSummaryComponent } from './plants-evenet-summary.component';

describe('PlantsEvenetSummaryComponent', () => {
  let component: PlantsEvenetSummaryComponent;
  let fixture: ComponentFixture<PlantsEvenetSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlantsEvenetSummaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlantsEvenetSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
