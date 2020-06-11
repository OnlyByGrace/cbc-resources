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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  title = 'cbc-resources';
  flyoutOpen = false;
  loading = false;
  endOfResults = false;

  latestSermon: Resource;

  configurationId: string;

  nextPage: Subject<number> = new Subject();
  resourceStream: Observable<Resource[]>;
  resources: Resource[];

  @ViewChild(FilterBarComponent, { static: true })
  filterBar: FilterBarComponent;

  activeFilters: FilterSet;

  carousels: Carousel[];

  constructor(
    private _resourceService: ResourceService,
    private _cd: ChangeDetectorRef,
    private _zone: NgZone,
    el: ElementRef) {
    this.configurationId = el.nativeElement.getAttribute('configurationId');
  }

  ngOnInit() {
    this.loading = true;

    this.resourceStream = this.filterBar.filtersChanged.pipe(
      tap((filters) => {
        this.activeFilters = filters || [];
        this.endOfResults = false;
        this.resources = null;
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

  // filtersChanged(filterSet: FilterSet) {
  //   this.activeFilters = filterSet;
  // }

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

  // Generate carousels from the 3 most frequently updated resources in the past 60 days
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

    this.carousels = Object.keys(resourcesByChannel).reduce((values, key) => {
      values.push(resourcesByChannel[key])
      return values;
    }, [])
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
        filter: this.activeFilters[0],
        filterValue: this.activeFilters[0].possibleAttributeValues.find((fv) => fv.Value == values[0].Type.toString()),
        resources: values.slice(0, 4)
      }
    })
    // .slice(0,3);
  }

  fetchResources(ignore, page: number): Observable<Resource[]> {
    return this._resourceService.getResources(this.activeFilters, page + 1);
  }

  loadNextPage() {
    this.nextPage.next();
    this.loading = true;
  }
}
