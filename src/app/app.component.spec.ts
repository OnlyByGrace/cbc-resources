import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { StubFilterBar, StubsModule, StubResourceService } from 'src/stubs/stubs.module';
import { AppComponent } from './app.component';
import { AppConfigService } from './app.config.service';
import { ResourceService } from './resource.service';

let sampleFilters = require('./sample-filters.json');

let appConfigService = {
  getConfig() { return sampleFilters }
}

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StubsModule
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        { provide: AppConfigService, useValue: appConfigService },
        { provide: ResourceService, useClass: StubResourceService },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
  })

  it('should create the app', () => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should load possible attribute values into dropdowns via AppConfigService', (done) => {
    const filterBar = fixture.debugElement.query(By.directive(StubFilterBar));
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(filterBar.componentInstance.filters).toEqual(sampleFilters);
      done();
    })

  });

  // it should allow ordering by passage

  // it should allow continous scrolling
});
