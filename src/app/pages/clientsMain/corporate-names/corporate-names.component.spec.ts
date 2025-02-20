import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateNamesComponent } from './corporate-names.component';

describe('CorporateNamesComponent', () => {
  let component: CorporateNamesComponent;
  let fixture: ComponentFixture<CorporateNamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CorporateNamesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CorporateNamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
