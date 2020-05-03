import { Component, OnInit, ViewChild, ViewEncapsulation, HostListener, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
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

  @ViewChild(FilterBarComponent, {static: true})
  filterBar: FilterBarComponent;

  filters: FilterSet;
  activeFilters: FilterSet;

  constructor(private _resourceService: ResourceService, private _appConfigService: AppConfigService, private _cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.filters = this._appConfigService.getConfig();
    this.activeFilters = this.filters.filter((filter) => filter.currentValue != undefined);
    this.loading = true;
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
    this.filterBar.showFilterFlyout(filter);
  }

  filterTopic() {
    let topic = this.activeFilters.find((filter) => filter.Name == 'All Topics' || filter.Name == "All Scriptures");

    if (topic) return topic.currentValue.Display;

    return "";
  }

  fetchResources(filterSet: FilterSet) {
    this.filters = [...filterSet];
    this.activeFilters = this.filters.filter((filter) => filter.currentValue != undefined);
    console.log(filterSet);
    this._cd.detectChanges();
  }
}
