import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddQyaComponent } from './add-qya.component';

describe('AddQyaComponent', () => {
  let component: AddQyaComponent;
  let fixture: ComponentFixture<AddQyaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddQyaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddQyaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
