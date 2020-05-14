import { Component, OnInit, Input, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FilterSet, ResourceService } from '../resource.service';
import { Resource } from '../Resource';
import { Observable } from 'rxjs';

@Component({
  selector: 'resource-list',
  templateUrl: './resource-list.component.html',
  styleUrls: ['./resource-list.component.scss']
})
export class ResourceListComponent implements OnInit {

  private _filters: FilterSet = [];

  @Input()
  set filters(filters: FilterSet) {
    console.log(this);
    this._filters = filters;
    this.resources = this._resourceService.getResources(this._filters);
  }

  get filters(): FilterSet {
    return this._filters;
  }

  resources: Observable<Resource[]>;

  constructor(private _resourceService: ResourceService, private _cd: ChangeDetectorRef) { }

  ngOnInit() {
      
  }

  openCard(resource: Resource) {
    document.location = "http://localhost:58469/resources/" + resource.Id;
  }

  getAttributeValue(resource: Resource, attributeName: string): string {
    if (!resource[attributeName]) return '';

    let multiSelectValues = resource[attributeName].split(',');
    let attribute = this._filters
        .find((filter) => filter.Name == attributeName)
        .possibleAttributeValues
        .filter(av => multiSelectValues.some((msv) => av.Value == msv.toLowerCase().replace(/[{}]/g,"")));

    return attribute ? attribute.map((a) => a.Display).join(', ') : resource[attributeName];
  }
}
