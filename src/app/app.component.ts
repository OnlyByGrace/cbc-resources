import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { take, delay } from 'rxjs/operators';
import { Resource } from './Resource';
import { FilterSet, ResourceService, Filter } from './resource.service';
import { FilterBarComponent } from './filter-bar/filter-bar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'cbc-resources';
  flyoutOpen = false;

  @ViewChild(FilterBarComponent, {static: true})
  filterBar: FilterBarComponent;

  resources: Observable<Resource[]>;
  filters: FilterSet;
  activeFilters: FilterSet;

  constructor(private _resourceService: ResourceService) { }

  ngOnInit() {
    this.filters = this._resourceService.getAvailableFilters();
    this.activeFilters = this.filters.filter((filter) => filter.currentValue != undefined)
    this.resources = this._resourceService.getResources(this.filters);
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

  fetchResources(filterSet: FilterSet) {
    this.filters = filterSet;
    this.activeFilters = this.filters.filter((filter) => filter.currentValue != undefined)
    this.resources = this._resourceService.getResources(this.filters).pipe(
      delay(1500)
    );
  }
}
