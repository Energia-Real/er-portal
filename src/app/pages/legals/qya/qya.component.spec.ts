import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QyaComponent } from './qya.component';

describe('QyaComponent', () => {
  let component: QyaComponent;
  let fixture: ComponentFixture<QyaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QyaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QyaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
