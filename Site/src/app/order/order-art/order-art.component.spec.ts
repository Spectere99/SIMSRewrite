import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderArtComponent } from './order-art.component';

describe('OrderArtComponent', () => {
  let component: OrderArtComponent;
  let fixture: ComponentFixture<OrderArtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderArtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderArtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
