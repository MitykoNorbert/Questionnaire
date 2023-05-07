import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FillOutComponent } from './fill-out.component';

describe('FillOutComponent', () => {
  let component: FillOutComponent;
  let fixture: ComponentFixture<FillOutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FillOutComponent]
    });
    fixture = TestBed.createComponent(FillOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
