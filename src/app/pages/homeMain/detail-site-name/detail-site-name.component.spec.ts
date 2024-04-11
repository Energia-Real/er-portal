import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailSiteNameComponent } from './detail-site-name.component';

describe('DetailSiteNameComponent', () => {
  let component: DetailSiteNameComponent;
  let fixture: ComponentFixture<DetailSiteNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailSiteNameComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailSiteNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
