import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalInvoiceDetailsComponent } from './modal-invoice-details.component';

describe('ModalInvoiceDetailsComponent', () => {
  let component: ModalInvoiceDetailsComponent;
  let fixture: ComponentFixture<ModalInvoiceDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalInvoiceDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalInvoiceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
