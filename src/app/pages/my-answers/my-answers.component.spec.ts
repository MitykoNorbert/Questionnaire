import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAnswersComponent } from './my-answers.component';

describe('MyAnswersComponent', () => {
  let component: MyAnswersComponent;
  let fixture: ComponentFixture<MyAnswersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyAnswersComponent]
    });
    fixture = TestBed.createComponent(MyAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
