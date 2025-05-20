import { ComponentFixture, TestBed } from '@angular/core/testing';

import { D3graphComponent } from './d3graph.component';

describe('D3graphComponent', () => {
  let component: D3graphComponent;
  let fixture: ComponentFixture<D3graphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [D3graphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(D3graphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
