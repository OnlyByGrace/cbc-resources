import { Component, OnInit, ɵLifecycleHooksFeature, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';
import { Filter, ResourceService, FilterValue, FilterSet } from '../resource.service';
import { Subscription, Observable } from 'rxjs';

@Component({
  selector: 'cbc-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss']
})
export class FilterBarComponent implements OnInit {
  flyoutOpen = false;
  indicatorLeft = 0;

  @Input()
  filters: Filter[];

  @Output()
  flyoutOpened = new EventEmitter();
  @Output()
  flyoutClosed = new EventEmitter();

  @Output()
  filtersChanged = new EventEmitter<FilterSet>();

  @ViewChild('inner', { static: true })
  child: ElementRef;

  @ViewChild('indicator', { static: true })
  indicator: ElementRef;

  @ViewChild('flyOut', { static: true })
  flyOut: ElementRef;

  activeFilter: Filter = null;
  options: FilterValue[];

  constructor(private _resourceService: ResourceService) { }

  ngOnInit() {
    
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
    this.indicator.nativeElement.style.width = dropdown.clientWidth + 10 + "px";
    this.child.nativeElement.scrollLeft = dropdown.offsetLeft - 40;

    if (!this.flyoutOpen) {
      this.flyoutOpened.emit();
      this.flyoutOpen = true;
    }
  }

  showFilterFlyout(filter: Filter) {
    this.openFlyout(filter, this.child.nativeElement.querySelector('.dropdown[data-filter-name="'+filter.name+'"]'));
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

  valueSelected(filter: Filter, value: FilterValue) {
    filter.currentValue = value;
    this.closeFlyout();
    this.filtersChanged.emit(this.filters);
  }
}
