import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { from, Observable } from 'rxjs';
import { StubsModule, StubResourceService } from 'src/stubs/stubs.module';
import { Resource } from '../Resource';
import { ResourceService } from '../resource.service';
import { ResourceListComponent } from './resource-list.component';

let sampleFilters = require('../sample-filters.json');

let resourceServiceStub = new StubResourceService();
resourceServiceStub.getResources = function () {
  return from([[{
    Id: 1,
    Title: '2',
    Preview: 'Test Element',
    StartDateTime: '1',
    Author: '9a6288f6-39c0-4927-834a-515a91558367',
    Embed: '',
    Scripture: '',
    Topic: '',
    Series: '',
    Thumbnail: ''
  }]]);
}

describe('ResourceListComponent', () => {
  let component: ResourceListComponent;
  let fixture: ComponentFixture<ResourceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StubsModule
      ],
      providers: [
        { provide: ResourceService, useValue: resourceServiceStub }
      ],
      declarations: [ResourceListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceListComponent);
    component = fixture.componentInstance;
    component.filters = sampleFilters;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should pull latest 20 resources sorted by date', () => {
    let resourceService = TestBed.get(ResourceService);
    spyOn(resourceService, 'getResources').and.callThrough();

    console.log('calling');
    fixture.detectChanges();
    component.filters = sampleFilters;
    expect(component.filters).toEqual(sampleFilters);

    expect(resourceService.getResources).toHaveBeenCalled();
    console.log(fixture.nativeElement.textContent);
    expect(fixture.nativeElement.textContent).toContain('Test Element');
  })

  describe('getAttributeValue', () => {
    it('should ignore empty values', () => {
      let value: string = component.getAttributeValue(<any>{
        Name: 'Test',
        Author: '9a6288f6-39c0-4927-834a-515a91558367'
      }, 'Authoasdfasdr');

      expect(value).toBe('');
    });

    it('should return the correct display value for an attribute value', () => {
      let value: string = component.getAttributeValue(<any>{
        Name: 'Test',
        Author: '9a6288f6-39c0-4927-834a-515a91558367'
      }, 'Author');

      expect(value).toBe('David Hogg');
    });

    it('should accept comma separated values', () => {
      let value: string = component.getAttributeValue(<any>{
        Name: 'Test',
        Author: '9a6288f6-39c0-4927-834a-515a91558367,577c50a0-93aa-4407-a082-16ebba2f79ba'
      }, 'Author');

      expect(value).toBe('David Hogg, Luke Bennett');
    });
  })
});
