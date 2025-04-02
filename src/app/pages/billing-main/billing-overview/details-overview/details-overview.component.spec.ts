import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsOverviewComponent } from './details-overview.component';

describe('DetailsOverviewComponent', () => {
  let component: DetailsOverviewComponent;
  let fixture: ComponentFixture<DetailsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailsOverviewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
