import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCorporateNameComponent } from './edit-corporate-name.component';

describe('EditCorporateNameComponent', () => {
  let component: EditCorporateNameComponent;
  let fixture: ComponentFixture<EditCorporateNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditCorporateNameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditCorporateNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
