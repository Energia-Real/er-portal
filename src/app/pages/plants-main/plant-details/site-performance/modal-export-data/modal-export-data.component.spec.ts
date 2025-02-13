import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalExportDataComponent } from './modal-export-data.component';

describe('ModalExportDataComponent', () => {
  let component: ModalExportDataComponent;
  let fixture: ComponentFixture<ModalExportDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalExportDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ModalExportDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
