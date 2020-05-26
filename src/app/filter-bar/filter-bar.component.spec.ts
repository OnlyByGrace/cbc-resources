import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterBarComponent } from './filter-bar.component';
import { ResourceService } from '../resource.service';
import { StubResourceService } from 'src/stubs/stubs.module.spec';

describe('FilterBarComponent', () => {
  let component: FilterBarComponent;
  let fixture: ComponentFixture<FilterBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [{provide: ResourceService, useClass: StubResourceService }],
      declarations: [ FilterBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it should display filters with possible values

  // it should insert an "all" possible value with the correct pluralized form of each filter

  
});
