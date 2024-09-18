import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeBackOfficeComponent } from './home-back-office.component';

describe('HomeBackOfficeComponent', () => {
  let component: HomeBackOfficeComponent;
  let fixture: ComponentFixture<HomeBackOfficeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeBackOfficeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HomeBackOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
