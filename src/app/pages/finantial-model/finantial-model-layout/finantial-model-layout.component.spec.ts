import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinantialModelLayoutComponent } from './finantial-model-layout.component';

describe('FinantialModelLayoutComponent', () => {
  let component: FinantialModelLayoutComponent;
  let fixture: ComponentFixture<FinantialModelLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FinantialModelLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FinantialModelLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
