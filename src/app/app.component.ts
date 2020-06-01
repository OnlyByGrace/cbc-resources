import { ChangeDetectorRef, Component, ElementRef, NgZone, OnInit, ViewChild, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { fromEvent, Observable, Subject } from 'rxjs';
import { concatMap, map, scan, startWith, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AppConfigService } from './app.config.service';
import { Carousel } from './Carousel';
import { FilterBarComponent } from './filter-bar/filter-bar.component';
import { Resource } from './Resource';
import { Filter, FilterSet, ResourceService } from './resource.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy .OnPush
})
export class AppComponent implements OnInit {
  title = 'cbc-resources';
  flyoutOpen = false;
  loading = false;
  endOfResults = false;

  latestSermon: Resource;

  configurationId: string;

  hashChange: Observable<Event> = fromEvent(window, 'hashchange');
  nextPage: Subject<number> = new Subject();
  resourceStream: Observable<Resource[]>;
  resources: Resource[];

  @ViewChild(FilterBarComponent, { static: true })
  filterBar: FilterBarComponent;

  filters: FilterSet;
  activeFilters: FilterSet;

  carousels: Carousel[];

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

    this.loading = true;

    this.resourceStream = this.hashChange.pipe(
      startWith(0),
      tap(() => {
        this.endOfResults = false;
        this.resources = null;
        this.parseFilterValuesFromUrl();
        this._cd.markForCheck();
      }),
      switchMap(() => this.nextPage.pipe(
        startWith(0), 
        tap(() => this.loading = true),
        concatMap(this.fetchResources.bind(this)),
        scan((resources, newResources) => {
          if (newResources.length < 36) this.endOfResults = true;
          resources.push(...newResources);
          return resources;
        }),
        tap((resources) => {
          if (this.isHomeScreen()) {
            this.getLatestSermon(resources);
            this.generateCarousels(resources);
          }

          if (resources.length < 36) this.endOfResults = true;
          this.loading = false;
          // this._cd.markForCheck();
        })
      )
      )
    )
    
    this.resourceStream.subscribe((resources) => {
      this.resources = resources;
      this._cd.markForCheck();
    })
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

  isHomeScreen(): boolean {
    return this.activeFilters && this.activeFilters.length == 1 && this.activeFilters[0].currentValue.Display == "All Types";
  }

  filterTopic() {
    if (!this.activeFilters) return;

    let topic = this.activeFilters.find((filter) => filter.Name == 'All Topics' || filter.Name == "All Scriptures");

    if (topic) return topic.currentValue.Display;

    return "";
  }

  getLatestSermon(resources: Resource[]) {
    this.latestSermon = resources.find((resource) => resource.Type == environment.sermonContentChannelId);
    if (this.latestSermon && this.latestSermon.Thumbnail)
    this.latestSermon.Thumbnail = this.latestSermon.Thumbnail.replace('295x166','1920x1080');
  }

  generateCarousels(resources: Resource[]) {
    let resourcesByChannel = resources.reduce((resourcesByChannel, resource) => {
      let publishDate = new Date(resource.StartDateTime).getTime();
      if (new Date().getTime() - publishDate < 1000*60*60*24*60) {
        if (!resourcesByChannel[resource.Type]) {
          resourcesByChannel[resource.Type] = [];
        }

        resourcesByChannel[resource.Type].push(resource);
      }
      return resourcesByChannel;
    }, {});

    this.carousels = Object.values(resourcesByChannel)
    .sort((a: Resource[], b: Resource[]) => {
      if (b.length == a.length) {
        // Determine which has the most recent resource
        let bLatestResource = new Date(b.sort((r1, r2) => new Date(r2.StartDateTime).getTime() - new Date(r1.StartDateTime).getTime())[0].StartDateTime).getTime();
        let aLatestResource = new Date(a.sort((r1, r2) => new Date(r2.StartDateTime).getTime() - new Date(r1.StartDateTime).getTime())[0].StartDateTime).getTime();

        return bLatestResource-aLatestResource;
      } else {
        return b.length - a.length
      }
    })
    .map((values: Resource[]): Carousel => {
      return {
        filter: this.filters[0],
        filterValue: this.filters[0].possibleAttributeValues.find((fv) => fv.Value == values[0].Type.toString()),
        resources: values.slice(0, 4)
      }
    })
    .slice(0,3);
  }

  fetchResources(ignore, page: number): Observable<Resource[]> {
    return this._resourceService.getResources(this.activeFilters, page + 1);
  }

  parseFilterValuesFromUrl() {
    let urlFilterValues = window.location.hash.substring(1).split('&');

    this.filters.forEach(filter => filter.currentValue = null);

    for (let filterValue of urlFilterValues) {
      let [key, value] = filterValue.split('=');

      let matchingFilter = this.filters.find(filter => filter.Name == key);
      if (matchingFilter)
        matchingFilter.currentValue = matchingFilter.possibleAttributeValues.find(possibleValue => possibleValue.Value == value);
    }

    this.setActiveFilters();
  }
  
  filtersChanged(filterSet: FilterSet) {
    this.filters = [...filterSet];

    this.setActiveFilters();
    
    window.location.hash = "#" + this.activeFilters.filter(filter => filter.currentValue.Value != null).map(filter => filter.Name + "=" + filter.currentValue.Value).join("&");
    console.log("manual:", this.activeFilters);
  }

  setActiveFilters() {
    // Make sure we always show "All Types"
    if (this.filters[0].currentValue == undefined) {
      this.filters[0].currentValue = this.filters[0].possibleAttributeValues[0];
    }

    this.activeFilters = this.filters.filter((filter) => filter.currentValue != undefined);
  }

  loadNextPage() {
    this.nextPage.next();
    this.loading = true;
  }
}
