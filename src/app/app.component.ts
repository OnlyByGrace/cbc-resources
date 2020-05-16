import { Component, OnInit, ViewChild, ViewEncapsulation, HostListener, ChangeDetectionStrategy, ChangeDetectorRef, Input, ElementRef, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { take, delay } from 'rxjs/operators';
import { Resource } from './Resource';
import { FilterSet, ResourceService, Filter } from './resource.service';
import { FilterBarComponent } from './filter-bar/filter-bar.component';
import { AppConfigService } from './app.config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  title = 'cbc-resources';
  flyoutOpen = false;
  loading = false;

  configurationId: string;

  @ViewChild(FilterBarComponent, { static: true })
  filterBar: FilterBarComponent;

  filters: FilterSet;
  activeFilters: FilterSet;

  constructor(
    private _resourceService: ResourceService,
    private _appConfigService: AppConfigService,
    private _cd: ChangeDetectorRef,
    private _zone: NgZone,
    el: ElementRef) {
    this.configurationId = el.nativeElement.getAttribute('configurationId');
  }

  ngOnInit() {
    this.filters = this._appConfigService.getConfig();

    this.getFilterValuesFromUrl();
    this.loading = true;

    console.log(this.configurationId);
  }

  flyoutOpened() {
    document.body.style.overflow = 'hidden';
    this.flyoutOpen = true;
  }

  flyoutClosed() {
    document.body.style.overflow = 'auto';
    this.flyoutOpen = false;
  }

  filterClicked(filter: Filter) {
    console.log('none');
    this.filterBar.showFilterFlyout(filter);
  }

  filterTopic() {
    let topic = this.activeFilters.find((filter) => filter.Name == 'All Topics' || filter.Name == "All Scriptures");

    if (topic) return topic.currentValue.Display;

    return "";
  }

  @HostListener('window:hashchange')
  getFilterValuesFromUrl() {
    let urlFilterValues = window.location.hash.substring(1).split('&');

    this.filters.forEach(filter => filter.currentValue = null);

    for (let filterValue of urlFilterValues) {
      let [key,value] = filterValue.split('=');

      let matchingFilter = this.filters.find(filter => filter.Name == key);
      if (matchingFilter)
        matchingFilter.currentValue = matchingFilter.possibleAttributeValues.find(possibleValue => possibleValue.Value == value);
    }

    if (urlFilterValues[0] == "") {
      this.filters[0].currentValue = this.filters[0].possibleAttributeValues[0];
    }

    this.activeFilters = this.filters.filter((filter) => filter.currentValue != undefined);

    this._cd.detectChanges();
    
  }

  fetchResources(filterSet: FilterSet) {
    this.filters = [...filterSet];
    this.activeFilters = this.filters.filter((filter) => filter.currentValue != undefined);
    
    location.hash = "#"+this.activeFilters.filter(filter=>filter.currentValue.Value != null).map(filter => filter.Name + "=" + filter.currentValue.Value).join("&");

    // this._cd.markForCheck();
  }
}
