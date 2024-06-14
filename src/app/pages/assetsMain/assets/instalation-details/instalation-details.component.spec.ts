import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstalationDetailsComponent } from './instalation-details.component';

describe('InstalationDetailsComponent', () => {
  let component: InstalationDetailsComponent;
  let fixture: ComponentFixture<InstalationDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstalationDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InstalationDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
