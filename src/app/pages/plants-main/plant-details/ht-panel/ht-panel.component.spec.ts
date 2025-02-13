import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HtPanelComponent } from './ht-panel.component';

describe('HtPanelComponent', () => {
  let component: HtPanelComponent;
  let fixture: ComponentFixture<HtPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HtPanelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HtPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
