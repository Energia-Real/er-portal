import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabulatorTableComponent } from './tabulator-table.component';

describe('TabulatorTableComponent', () => {
  let component: TabulatorTableComponent;
  let fixture: ComponentFixture<TabulatorTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabulatorTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TabulatorTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
