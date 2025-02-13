import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteDetailsComponent } from './site-details.component';

describe('SiteDetailsComponent', () => {
  let component: SiteDetailsComponent;
  let fixture: ComponentFixture<SiteDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SiteDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SiteDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
