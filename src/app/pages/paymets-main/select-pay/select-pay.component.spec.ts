import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectPayComponent } from './select-pay.component';

describe('SelectPayComponent', () => {
  let component: SelectPayComponent;
  let fixture: ComponentFixture<SelectPayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelectPayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelectPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
