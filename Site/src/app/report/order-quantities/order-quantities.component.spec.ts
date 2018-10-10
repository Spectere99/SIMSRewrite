import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderQuantitiesComponent } from './order-quantities.component';

describe('OrderQuantitiesComponent', () => {
  let component: OrderQuantitiesComponent;
  let fixture: ComponentFixture<OrderQuantitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderQuantitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderQuantitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
