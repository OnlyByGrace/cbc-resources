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
  @Input()
  resources: Observable<Resource[]>;

  constructor() { }

  ngOnInit() {
      
  }
}
