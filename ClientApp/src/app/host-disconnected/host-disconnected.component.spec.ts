import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostDisconnectedComponent } from './host-disconnected.component';

describe('HostDisconnectedComponent', () => {
  let component: HostDisconnectedComponent;
  let fixture: ComponentFixture<HostDisconnectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostDisconnectedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostDisconnectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
