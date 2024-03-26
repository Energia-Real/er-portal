import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnBarComponent } from './return-bar.component';

describe('ReturnBarComponent', () => {
  let component: ReturnBarComponent;
  let fixture: ComponentFixture<ReturnBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReturnBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReturnBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
