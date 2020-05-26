import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { from, Observable } from 'rxjs';
import { StubsModule, StubResourceService, StubResourceCard } from 'src/stubs/stubs.module.spec';
import { Resource } from '../Resource';
import { ResourceService, FilterSet } from '../resource.service';
import { ResourceListComponent } from './resource-list.component';
import { Component, ViewChild } from '@angular/core';

let sampleFilters = require('../sample-filters.json');

let resourceServiceStub = new StubResourceService();
resourceServiceStub.getResources = function (filterSet: FilterSet) {
  return from([[<Resource>{
    Id: 1,
    Type: 10,
    Title: '2',
    Preview: 'Test Element',
    StartDateTime: '1',
    Author: '9a6288f6-39c0-4927-834a-515a91558367',
    Embed: '',
    Scripture: '',
    Topic: '',
    Series: '',
    Thumbnail: '',
    AudioAvailable: 0,
    TextAvailable: 0,
    VideoAvailable: 0
  }]]);
}

@Component({
  template: '<resource-list [resources]="sampleResources"></resource-list>',
  selector: 'resource-list-wrapper'
})
class ResourceListWrapper {
  sampleResources: Observable<Resource[]> = from([[<Resource>{
    Id: 1,
    Type: 10,
    Title: '2',
    Preview: 'Test Element',
    StartDateTime: '1',
    Author: '9a6288f6-39c0-4927-834a-515a91558367',
    Embed: '',
    Scripture: '',
    Topic: '',
    Series: '',
    Thumbnail: '',
    AudioAvailable: 0,
    TextAvailable: 0,
    VideoAvailable: 0
  }]]);

  @ViewChild(ResourceListComponent, { static: true })
  resourceList: ResourceListComponent;

  constructor() { }
}

describe('ResourceListComponent', () => {
  let component: ResourceListComponent;
  let fixture: ComponentFixture<ResourceListWrapper>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
      ],
      providers: [
          
      ],
      declarations: [ResourceListWrapper, ResourceListComponent, StubResourceCard]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceListWrapper);
    component = fixture.componentInstance.resourceList;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show a resource card for each resource in the observable', () => {
    
  })
});
