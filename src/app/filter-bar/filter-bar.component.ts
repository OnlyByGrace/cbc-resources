import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Subject, Observable, fromEvent } from 'rxjs';
import { Filter, FilterSet, FilterValue, ResourceService } from '../resource.service';
import { filter, debounceTime, tap } from 'rxjs/operators';
import { AppConfigService } from '../app.config.service';

@Component({
    selector: 'cbc-filter-bar',
    templateUrl: './filter-bar.component.html',
    styleUrls: ['./filter-bar.component.scss']
})
export class FilterBarComponent implements OnInit {
    flyoutOpen = false;
    indicatorLeft = 0;

    searchMode: boolean = false;
    searchText: string = "";

    filters: Filter[];

    hashChange: Observable<Event> = fromEvent(window, 'hashchange');

    @Output()
    flyoutOpened = new EventEmitter();
    @Output()
    flyoutClosed = new EventEmitter();
    @Output()
    filtersChanged = new EventEmitter<FilterSet>();

    searchTerm$ = new Subject<string>();

    @ViewChild('inner', { static: true })
    child: ElementRef;
    @ViewChild('indicator', { static: true })
    indicator: ElementRef;
    @ViewChild('flyOut', { static: true })
    flyOut: ElementRef;
    @ViewChild('search')
    search: ElementRef;

    activeFilter: Filter = null;
    options: FilterValue[];

    constructor(private _resourceService: ResourceService, private _appConfig: AppConfigService) { }

    ngOnInit() {
        this.filters = this._appConfig.getConfig();

        this.searchTerm$.pipe(
            debounceTime(500)
        ).subscribe((searchValue) => {
            if (!this.search || searchValue.length < 3) return;
            this.searchChanged(searchValue);
        })

        this.hashChange.subscribe(this.hashChanged.bind(this));

        this.hashChanged();
    }

    closeFlyout() {
        this.flyoutOpen = false;
        this.filters.forEach((filter) => (<any>filter).active = false);
        this.flyoutClosed.emit();
    }

    openFlyout(filter: Filter, dropdown: HTMLElement) {
        this.activeFilter = filter;

        this.flyOut.nativeElement.style.top = this.child.nativeElement.getBoundingClientRect().bottom + "px";

        this.filters.forEach((filter) => (<any>filter).active = false);
        (<any>filter).active = true;

        (<HTMLElement>this.indicator.nativeElement).style.left = dropdown.offsetLeft - 5 + "px";
        this.indicator.nativeElement.style.width = dropdown.offsetWidth + 10 + "px";
        this.child.nativeElement.scrollLeft = dropdown.offsetLeft - 40;

        if (!this.flyoutOpen) {
            this.flyoutOpened.emit();
            this.flyoutOpen = true;
        }
    }

    showFilterFlyout(filter: Filter) {
        if (this.searchMode) {
            this.search.nativeElement.focus();
        } else {
            this.openFlyout(filter, this.child.nativeElement.querySelector('.dropdown[data-filter-name="' + filter.Name + '"]'));
        }
    }

    toggleSearch(event: Event) {
        this.searchMode = !this.searchMode;
        if (this.searchMode && this.flyoutOpen) {
            this.closeFlyout();
        }
        setTimeout(() => {
            if (this.searchMode) {
                this.child.nativeElement.scrollLeft = (<HTMLElement>event.target).offsetLeft - 10;
                console.log((<HTMLElement>event.target).offsetLeft - 40);
                this.search.nativeElement.focus();
            }
        }, 10);

        if (!this.searchMode) {
            this.setHash(this.filters)
        }
    }

    searchChanged(newValue: string) {
        // this.search.nativeElement.blur();
        this.setHash(this.getSearchFilter(newValue));
    }

    toggleFlyout(filter: Filter, event: Event) {

        if (this.flyoutOpen) {
            if ((<any>filter).active == true) {
                this.closeFlyout();
            } else {
                this.openFlyout(filter, <HTMLElement>event.currentTarget);
            }
        } else {
            this.openFlyout(filter, <HTMLElement>event.currentTarget);
        }
    }

    goHome() {
        this.setHash([]);
    }

    cancelValue(filter, event: Event) {
        event.stopImmediatePropagation();
        event.stopPropagation();
        event.preventDefault();
        this.valueSelected(filter, filter.possibleAttributeValues[0])
    }

    getSearchFilter(forSearchString: string): Filter[] {
        return [{
            Id: -3,
            Name: "Search",
            currentValue: {
                Display: null,
                Value: forSearchString,
            },
            possibleAttributeValues: null
        }];
    }

    hashChanged() {
        let urlFilterValues = window.location.hash.substring(1).split('&');

        // If this is a search hash, activate search mode and publish the search filter
        // We handle this as a unique filter so that if we cancel the search, our old filters come back
        if (urlFilterValues[0].indexOf('Search=') > -1) {
            this.searchMode = true;
            this.searchText = decodeURIComponent(urlFilterValues[0].split('=')[1]);
            this.publishFilters(this.getSearchFilter(this.searchText));
        } else {
            this.searchMode = false;
            this.filters.forEach(filter => filter.currentValue = null);
    
            for (let filterValue of urlFilterValues) {
                let [key, value] = filterValue.split('=');
                const matchingFilter = this.filters.find(filter => filter.Name == key);

                if (matchingFilter != undefined && matchingFilter.possibleAttributeValues != undefined) {
                    matchingFilter.currentValue = matchingFilter.possibleAttributeValues.find(possibleValue => possibleValue.Value == value);
                }
                
                if (matchingFilter && !matchingFilter.currentValue) matchingFilter.currentValue = { Value: value, Display: null };
            }

            if (this.filters[0].currentValue == undefined) {
                this.filters[0].currentValue = this.filters[0].possibleAttributeValues[0];
            }

            this.publishFilters(this.filters);
        }

    }

    setHash(filters: Filter[]) {
        window.location.hash = "#" + filters.filter(filter => filter.currentValue?.Value != null).map(filter => filter.Name + "=" + filter.currentValue.Value).join("&");
    }

    // filtersChanged(filterSet: FilterSet) {
    //   this.filters = [...filterSet];

    //   this.setActiveFilters();

    //   window.location.hash = "#" + this.activeFilters.filter(filter => filter.currentValue.Value != null).map(filter => filter.Name + "=" + filter.currentValue.Value).join("&");
    //   console.log("manual:", this.activeFilters);
    // }

    publishFilters(filters: Filter[]) {
        this.filtersChanged.emit(filters.filter(filter => filter.currentValue != null));
    }

    valueSelected(filter: Filter, value: FilterValue) {
        if (value && value.default == true && filter.Name != "All Types") {
            filter.currentValue = undefined;
        } else {
            filter.currentValue = value;
        }
        this.closeFlyout();
        this.setHash(this.filters);
    }
}
