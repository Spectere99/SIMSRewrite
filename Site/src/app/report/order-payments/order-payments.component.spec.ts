import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPaymentsComponent } from './order-payments.component';

describe('OrderPaymentsComponent', () => {
  let component: OrderPaymentsComponent;
  let fixture: ComponentFixture<OrderPaymentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderPaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
