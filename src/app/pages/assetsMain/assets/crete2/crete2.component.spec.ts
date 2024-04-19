import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Crete2Component } from './crete2.component';

describe('Crete2Component', () => {
  let component: Crete2Component;
  let fixture: ComponentFixture<Crete2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Crete2Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Crete2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
