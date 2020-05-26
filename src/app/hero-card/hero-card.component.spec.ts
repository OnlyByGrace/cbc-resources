import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroCardComponent } from './hero-card.component';
import { StubsModule, StubAppConfigService } from 'src/stubs/stubs.module.spec';
import { AppConfigService } from '../app.config.service';
import { Resource } from '../Resource';


describe('HeroCardComponent', () => {
  let component: HeroCardComponent;
  let fixture: ComponentFixture<HeroCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StubsModule],
      providers: [{ provide: AppConfigService, useClass: StubAppConfigService }],
      declarations: [HeroCardComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeroCardComponent);
    component = fixture.componentInstance;
    component.resource = {
      Id: 0,
      Type: 0,
      AudioAvailable: 0,
      Author: '',
      Preview: '',
      Scripture: '',
      Series: '',
      StartDateTime: '',
      TextAvailable: 0,
      Thumbnail: '',
      Title: '',
      Topic: '',
      VideoAvailable: 0
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
