import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselCardComponent } from './carousel-card.component';
import { AppConfigService } from 'src/app/app.config.service';
import { StubAppConfigService } from 'src/stubs/stubs.module.spec';

describe('CarouselCardComponent', () => {
  let component: CarouselCardComponent;
  let fixture: ComponentFixture<CarouselCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: AppConfigService, useClass: StubAppConfigService }],
      declarations: [ CarouselCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarouselCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
