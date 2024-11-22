import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationCardCenterComponent } from './notification-card-center.component';

describe('NotificationCardCenterComponent', () => {
  let component: NotificationCardCenterComponent;
  let fixture: ComponentFixture<NotificationCardCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationCardCenterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotificationCardCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
