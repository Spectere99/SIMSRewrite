import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NumberCorrectionComponent } from './number-correction.component';

describe('NumberCorrectionComponent', () => {
  let component: NumberCorrectionComponent;
  let fixture: ComponentFixture<NumberCorrectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumberCorrectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberCorrectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
