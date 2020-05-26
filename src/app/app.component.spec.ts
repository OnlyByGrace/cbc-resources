import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { from } from 'rxjs';
import { generateRandomResources, StubFilterBar, StubsModule } from 'src/stubs/stubs.module.spec';
import { AppComponent } from './app.component';
import { AppConfigService } from './app.config.service';
import { Carousel } from './Carousel';
import { ResourceService } from './resource.service';

let sampleFilters = require('./sample-filters.json');

let appConfigService = {
    getConfig() { return sampleFilters }
}

let resourceService = jasmine.createSpyObj('resourceService', ['getResources']);

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
                { provide: ResourceService, useValue: resourceService },
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

    it('should show carousels for the 3 most frequently updated types', () => {

    });

    describe('getCarousels', () => {
        it('should set carousels to be 3 most frequently updated types in latest resource set', (done) => {
            const app = fixture.componentInstance;

            /* Defined "most frequently updated" as those with the most number of posts
               in the last 60 days. Should show as "most updated" to "least updated" */

            let currentTime = new Date().getTime();
            let time60DaysAgo = currentTime - (1000 * 60 * 60 * 24 * 60);
            let resources = generateRandomResources(10);

            let filters = [
                {
                    Id: 1,
                    Name: 'Types',
                    possibleAttributeValues: [
                        {
                            Value: '1',
                            Display: 'Channel 1'
                        },
                        {
                            Value: '2',
                            Display: 'Channel 2'
                        },
                        {
                            Value: '3',
                            Display: 'Channel 3'
                        },
                        {
                            Value: '4',
                            Display: 'Channel 4'
                        },
                        {
                            Value: '5',
                            Display: 'Channel 5'
                        }
                    ]
                }
            ]

            let appConfigService = TestBed.get(AppConfigService);
            spyOn(appConfigService, 'getConfig').and.returnValue(filters);

            // Channel 1 = 3, all in past 60 days
            // Channel 2 = 3, 1 50 days ago
            // Channel 3 = 2, both in past 60 days
            // Channel 4 = 1, 40 days ago
            // Channel 5 = 1, 80 days ago
            resources[0].Type = 1;
            resources[0].StartDateTime = new Date(currentTime - (1000 * 60 * 60 * 24 * 5)).toISOString();
            resources[1].Type = 1;
            resources[1].StartDateTime = new Date(currentTime - (1000 * 60 * 60 * 24 * 40)).toISOString();
            resources[2].Type = 1;
            resources[2].StartDateTime = new Date(currentTime - (1000 * 60 * 60 * 24 * 4)).toISOString();
            resources[3].Type = 2;
            resources[3].StartDateTime = new Date(currentTime - (1000 * 60 * 60 * 24 * 50)).toISOString();
            resources[4].Type = 2;
            resources[4].StartDateTime = new Date(currentTime - (1000 * 60 * 60 * 24 * 75)).toISOString();
            resources[5].Type = 2;
            resources[5].StartDateTime = new Date(currentTime - (1000 * 60 * 60 * 24 * 77)).toISOString();
            resources[6].Type = 3;
            resources[6].StartDateTime = new Date(currentTime - (1000 * 60 * 60 * 24 * 42)).toISOString();
            resources[7].Type = 3;
            resources[7].StartDateTime = new Date(currentTime - (1000 * 60 * 60 * 24 * 38)).toISOString();
            resources[8].Type = 4;
            resources[8].StartDateTime = new Date(currentTime - (1000 * 60 * 60 * 24 * 40)).toISOString();
            resources[9].Type = 5;
            resources[9].StartDateTime = new Date(currentTime - (1000 * 60 * 60 * 24 * 80)).toISOString();

            resourceService.getResources.and.returnValue(from([resources]));

            fixture.detectChanges();

            // Carousels should be
            // Channel 1 (3 items)
            // Channel 3 (2 items)
            // Channel 4 (1 item)

            fixture.whenStable().then(() => {
                app.carousels.subscribe((carousels: Carousel[]) => {
                    console.log(carousels);

                    expect(carousels).toEqual([
                        {
                            filter: app.filters[0],
                            filterValue: app.filters[0].possibleAttributeValues[0],
                            resources: [resources[0], resources[1], resources[2]]
                        },
                        {
                            filter: app.filters[0],
                            filterValue: app.filters[0].possibleAttributeValues[2],
                            resources: [resources[6], resources[7]]
                        },
                        {
                            filter: app.filters[0],
                            filterValue: app.filters[0].possibleAttributeValues[3],
                            resources: [resources[8]]
                        }
                    ])

                    done();
                })
            })


        })
    });
});
