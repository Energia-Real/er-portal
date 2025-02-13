import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoProvidersDevicesComponent } from './info-providers-devices.component';

describe('InfoProvidersDevicesComponent', () => {
  let component: InfoProvidersDevicesComponent;
  let fixture: ComponentFixture<InfoProvidersDevicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InfoProvidersDevicesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InfoProvidersDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
