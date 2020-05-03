import { NgModule, Component, Input, ViewEncapsulation } from '@angular/core';
import { FilterSet } from 'src/app/resource.service';
import { from, Observable } from 'rxjs';
import { Resource } from 'src/app/Resource';

@Component({
    selector:'resource-list',
    template: ''
})
export class StubResourceList {
    @Input()
    filters: FilterSet;
}

@Component({
    selector: 'resource-card',
    template: 'Test <ng-content></ng-content>'
})
export class StubResourceCard {
    @Input()
    date: string;

    @Input()
    topic: string;

    @Input()
    author: string;

    @Input()
    type: string;
}

@Component({
    selector: 'cbc-filter-bar',
    template: ''
})
export class StubFilterBar {
  @Input()
  filters: string;
}

export class StubResourceService {
    getResources(filterSet: FilterSet): Observable<Resource[]> {
        return from([]);
    }
}


@NgModule({
    declarations: [
        StubFilterBar,
        StubResourceCard,
        StubResourceList
    ],
    exports: [
        StubFilterBar,
        StubResourceCard,
        StubResourceList
    ]
})
export class StubsModule { }