import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminQyaComponent } from './admin-qya.component';

describe('AdminQyaComponent', () => {
  let component: AdminQyaComponent;
  let fixture: ComponentFixture<AdminQyaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminQyaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminQyaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
