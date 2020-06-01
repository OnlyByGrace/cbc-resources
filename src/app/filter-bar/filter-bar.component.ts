import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { Filter, FilterSet, FilterValue, ResourceService } from '../resource.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'cbc-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss']
})
export class FilterBarComponent implements OnInit {
  flyoutOpen = false;
  indicatorLeft = 0;

  searchMode: boolean = false;


  private _filters;
  @Input()
  set filters(filters: Filter[]) {
    if (!this.searchMode) {
      this._filters = filters;
    }
  }

  get filters() {
    return this._filters;
  }

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

  constructor(private _resourceService: ResourceService) { }

  ngOnInit() {
    // this.searchTerm$.pipe(
    //   debounceTime(500)
    // ).subscribe((searchValue) => {
    //   if (!this.search) return;
    //   this.filtersChanged.emit([{
    //     name: "Search",
    //     type: FILTER_TYPES.SEARCH,
    //     currentValue: {
    //       displayName: searchValue,
    //       startValue: searchValue,
    //     },
    //     queryParameter: 'search'
    //   }])
    // })
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

  toggleSearch() {
    this.searchMode = !this.searchMode;
    if (this.searchMode && this.flyoutOpen) {
      this.closeFlyout();
    }
    setTimeout(() => {
      if (this.searchMode) {
        this.search.nativeElement.focus();
      }
    }, 0);

    if (!this.searchMode) {
      this.filtersChanged.emit(this._filters);
    }
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
    this.filtersChanged.emit(this.filters.map((filter) => {
      filter.currentValue = undefined;
      return filter;
    }));
  }

  cancelValue(filter, event: Event) {
    event.stopImmediatePropagation();
    event.stopPropagation();
    event.preventDefault();
    this.valueSelected(filter, filter.possibleAttributeValues[0])
  }

  valueSelected(filter: Filter, value: FilterValue) {
    if (value && value.default == true && filter.Name != "All Types") {
      filter.currentValue = undefined;
    } else {
      filter.currentValue = value;
    }
    this.closeFlyout();
    this.filtersChanged.emit(this.filters);
  }
}
