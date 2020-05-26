import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceCardComponent } from './resource-card.component';
import { StubsModule, StubAppConfigService } from 'src/stubs/stubs.module.spec';
import { AppConfigService } from '../app.config.service';

describe('ResourceCardComponent', () => {
  let component: ResourceCardComponent;
  let fixture: ComponentFixture<ResourceCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StubsModule],
      providers: [{ provide: AppConfigService, useClass: StubAppConfigService }],
      declarations: [ ResourceCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceCardComponent);
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
