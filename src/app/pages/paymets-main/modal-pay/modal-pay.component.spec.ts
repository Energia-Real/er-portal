import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPayComponent } from './modal-pay.component';

describe('ModalPayComponent', () => {
  let component: ModalPayComponent;
  let fixture: ComponentFixture<ModalPayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalPayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
