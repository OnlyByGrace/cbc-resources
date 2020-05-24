import { ChangeDetectorRef, Component, ElementRef, HostListener, NgZone, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AppConfigService } from './app.config.service';
import { FilterBarComponent } from './filter-bar/filter-bar.component';
import { Filter, FilterSet, ResourceService } from './resource.service';
import { Resource } from './Resource';
import { Observable, Subject, fromEvent, from, throwError } from 'rxjs';
import { concatMap, debounceTime, startWith, scan, switchMap, tap, take, map, reduce } from 'rxjs/operators';
import { Carousel } from './Carousel';

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
  endOfResults = false;

  latestSermon: Resource;

  configurationId: string;

  hashChange: Observable<Event> = fromEvent(window, 'hashchange');
  nextPage: Subject<number> = new Subject();
  resourceStream: Observable<Resource[]>;

  @ViewChild(FilterBarComponent, { static: true })
  filterBar: FilterBarComponent;

  filters: FilterSet;
  activeFilters: FilterSet;

  carousels: Observable<Carousel[]>;

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
      tap(this.parseFilterValuesFromUrl.bind(this)),
      tap(() => { this.endOfResults = false }),
      switchMap(() => this.nextPage.pipe(
        startWith(0),
        concatMap(this.fetchResources.bind(this)),
        scan((resources, newResources) => {
          if (newResources.length < 36) this.endOfResults = true;
          console.log(newResources.length);
          resources.push(...newResources);
          return resources;
        }),
        tap((resources) => {
          if (resources.length < 36) this.endOfResults = true;
          this.loading = false;
          this._cd.markForCheck();
        })
      )
      )
    )

    this.getLatestSermon();
    this.carousels = this.generateCarousels();
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
    if (!this.activeFilters) return;

    let topic = this.activeFilters.find((filter) => filter.Name == 'All Topics' || filter.Name == "All Scriptures");

    if (topic) return topic.currentValue.Display;

    return "";
  }

  getLatestSermon() {
    this.resourceStream.subscribe((resources: Resource[]) => {
      this.latestSermon = resources.find((resource) => resource.Type == 10);
      if (this.latestSermon && this.latestSermon.Thumbnail)
      this.latestSermon.Thumbnail = this.latestSermon.Thumbnail.replace('295x166','1920x1080');
    })
  }

  generateCarousels(): Observable<Carousel[]> {
    return this.resourceStream.pipe(
      map((resources) =>
        resources.reduce((resourcesByChannel, resource) => {
          let publishDate = new Date(resource.StartDateTime).getTime();
          if (new Date().getTime() - publishDate < 1000*60*60*24*60) {
            if (!resourcesByChannel[resource.Type]) {
              resourcesByChannel[resource.Type] = [];
            }

            resourcesByChannel[resource.Type].push(resource);
          }
          return resourcesByChannel;
        }, {})
      ),
      map((resourcesByChannel) => {
        return Object.values(resourcesByChannel)
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
      })
    )
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

    if (this.filters[0].currentValue == undefined) {
      this.filters[0].currentValue = this.filters[0].possibleAttributeValues[0];
    }

    this.activeFilters = this.filters.filter((filter) => filter.currentValue != undefined);
  }

  filtersChanged(filterSet: FilterSet) {
    this.filters = [...filterSet];
    this.activeFilters = this.filters.filter((filter) => filter.currentValue != undefined);
    window.location.hash = "#" + this.activeFilters.filter(filter => filter.currentValue.Value != null).map(filter => filter.Name + "=" + filter.currentValue.Value).join("&");
  }

  loadNextPage() {
    this.nextPage.next();
    this.loading = true;
  }
}
