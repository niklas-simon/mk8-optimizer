import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CombinListComponent } from './combin-list.component';

describe('CombinListComponent', () => {
  let component: CombinListComponent;
  let fixture: ComponentFixture<CombinListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CombinListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CombinListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
