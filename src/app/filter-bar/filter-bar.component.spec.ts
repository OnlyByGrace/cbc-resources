import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { from } from 'rxjs';
import { StubResourceService, StubAppConfigService } from 'src/stubs/stubs.module.spec';
import { AppConfigService } from '../app.config.service';
import { ResourceService, Filter } from '../resource.service';
import { FilterBarComponent } from './filter-bar.component';


let sampleFilters = require('../sample-filters.json');

class AppConfigServiceStub  {
    loadConfig() { return false }
    getConfig() { console.log('NOOOO'); return JSON.parse(JSON.stringify(sampleFilters)) }
}


describe('FilterBarComponent', () => {
    let component: FilterBarComponent;
    let fixture: ComponentFixture<FilterBarComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: ResourceService, useClass: StubResourceService },
                { provide: AppConfigService, useClass: AppConfigServiceStub }
            ],
            declarations: [FilterBarComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        window.location.hash = "";
        fixture = TestBed.createComponent(FilterBarComponent);
        component = fixture.componentInstance;
        component.hashChange = from([]);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // it should display filters with possible values
    it('should load possible attribute values into dropdowns via AppConfigService', () => {
        console.log(JSON.stringify(component.filters),JSON.stringify(sampleFilters));
        expect(component.filters).toEqual(sampleFilters.map(filter => {
            if (!filter.currentValue) filter.currentValue = null;
            return filter;
        }));
    });

    describe('searchChanged', () => {
        it('should call setHash with the search filter', () => {
            spyOn(component, 'setHash').and.stub();

            component.searchChanged('new search');

            expect(component.setHash).toHaveBeenCalledWith([{
                Id: -3,
                Name: "Search",
                currentValue: {
                    Display: null,
                    Value: 'new search',
                },
                possibleAttributeValues: null
            }])
        });
    });

    describe('toggleSearch', () => {
        // it should close the flyout if it's open
        // it should focus the search text box

        it('should call setHash with filters when searchMode is disabled', () => {
            spyOn(component, 'setHash').and.stub();
            component.searchMode = true;

            component.toggleSearch(null);

            expect(component.setHash).toHaveBeenCalledWith(component.filters);
        });
    });

    describe('setHash', () => {
        it('should append filters in the format to "Name=Value" to the url', () => {

        });
    });

    describe('publishFilters', () => {
        it('should publish the filters that have a value selected', () => {
            component.filters[0].currentValue = { Display: 'Test', Value: '1' };

            spyOn(component.filtersChanged, 'emit').and.stub();

            component.publishFilters(component.filters);
            expect(component.filtersChanged.emit).toHaveBeenCalledWith([<Filter>{
                ...sampleFilters[0],
                currentValue: { Display: 'Test', Value: '1' }
            }]);
        });
    });

    describe('valueSelected', () => {
        it('should update the filter with value that was selected', () => {

        });

        // it should close the flyout

        it('should call setHash with filters', () => {

        });
    });

    describe('hashChanged', () => {
        it('should be called on a hashchange event', () => {
            let bar = new FilterBarComponent(null, <any>new StubAppConfigService());

            spyOn(bar, 'hashChanged').and.stub();
            bar.ngOnInit();

            window.location.hash = "#test";

            bar.hashChanged();
            expect(bar.hashChanged).toHaveBeenCalled();
        });

        describe('if the first hash is a search hash', () => {
            it('should activate the search bar if not already active', () => {
                expect(component.searchMode).toBeFalsy();

                window.location.hash = "#Search=12345"

                component.hashChanged();
                expect(component.searchMode).toBeTruthy();
            });

            it('should update the search text if it does not match the search text', () => {
                expect(component.searchMode).toBeFalsy();

                window.location.hash = "#Search=my search term"

                component.hashChanged();
                fixture.detectChanges();
                expect(component.searchMode).toBe(true);
                expect(component.search.nativeElement.value).toBe("my search term");
            })

            it('should call publishFilters with a search filter', () => {
                spyOn(component, 'publishFilters').and.stub();

                expect(component.searchMode).toBeFalsy();

                window.location.hash = "#Search=my search term"

                component.hashChanged();

                fixture.detectChanges();
                expect(component.publishFilters).toHaveBeenCalledWith([<Filter>{
                    Id: -3,
                    Name: 'Search',
                    possibleAttributeValues: null,
                    currentValue: { Display: null, Value: 'my search term' }
                }]);
            });
        });

        describe('if hash is not search', () => {

            it('should parse the url into filter values', () => {
                window.location.hash = "#Type=12&Date=2004&Topic=95946564-dce9-4aac-b334-867584304a4a";

                component.hashChanged();

                expect(component.filters.filter(filter => filter.currentValue != undefined)).toEqual([
                    {
                        ...sampleFilters[0],
                        currentValue: { Display: 'Videos', Value: '12' }
                    },
                    {
                        ...sampleFilters[1],
                        currentValue: { Display: '2004', Value: '2004' }
                    },
                    {
                        ...sampleFilters[2],
                        currentValue: { Display: 'How to Study the Bible', Value: '95946564-dce9-4aac-b334-867584304a4a' }
                    }
                ]);

            });

            it('should disable the search bar', () => {
                // TODO: Uncomment this line and report it as a bug to Angular testing
                // expect(component.filters.filter(filter => filter.currentValue != null)).toEqual([]);
                
                component.searchMode = true;

                window.location.hash = "#Type=10"

                component.hashChanged();

                expect(component.searchMode).toBe(false);
            });



            it('should call publishFilters with the filters', () => {
                spyOn(component, 'publishFilters').and.stub();

                window.location.hash = "#Type=12&Date=2004&Topic=95946564-dce9-4aac-b334-867584304a4a";

                component.hashChanged();

                expect(component.publishFilters).toHaveBeenCalledWith(component.filters);
            });
        })
    })
});