import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeBackOfficeLayoutComponent } from './home-back-office-layout.component';

describe('HomeBackOfficeLayoutComponent', () => {
  let component: HomeBackOfficeLayoutComponent;
  let fixture: ComponentFixture<HomeBackOfficeLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeBackOfficeLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeBackOfficeLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
