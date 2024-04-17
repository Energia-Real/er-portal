import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewDetailsComponent } from './overview-details.component';

describe('OverviewDetailsComponent', () => {
  let component: OverviewDetailsComponent;
  let fixture: ComponentFixture<OverviewDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OverviewDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OverviewDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
