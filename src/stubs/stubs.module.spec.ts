import { NgModule, Component, Input, ViewEncapsulation } from '@angular/core';
import { FilterSet } from 'src/app/resource.service';
import { from, Observable } from 'rxjs';
import { Resource } from 'src/app/Resource';
import { StripHtmlPipe } from 'src/app/strip-html.pipe';

export function generateRandomResources(num: number): Resource[] {
    let resources: Resource[] = [];

    for (let i = 0; i<num; i++) {
        resources.push({
            Id: i,
            Type: Math.round(Math.random()*10),
            AudioAvailable: Math.round(Math.random()),
            TextAvailable: Math.round(Math.random()),
            VideoAvailable: Math.round(Math.random()),
            Author: Math.random().toString(36).substring(7),
            Topic: Math.random().toString(36).substring(7),
            Preview: Math.random().toString(36).substring(7),
            Scripture: Math.random().toString(36).substring(7),
            Series: Math.random().toString(36).substring(7),
            StartDateTime: new Date().toISOString(),
            Thumbnail: Math.random().toString(36).substring(7),
            Title: Math.random().toString(36).substring(7)
        });
    }

    return resources;
}

@Component({
    selector:'resource-list',
    template: ''
})
export class StubResourceList {
    @Input()
    resources: Observable<Resource[]>
}

@Component({
    selector: 'resource-card',
    template: 'Test <ng-content></ng-content>'
})
export class StubResourceCard {
    @Input()
    resource: Resource;
}

@Component({
    selector: 'cbc-filter-bar',
    template: ''
})
export class StubFilterBar {
  @Input()
  filters: string;
}

export class StubAppConfigService {
   getAttributeDisplayValue(resource: Resource, attribute: string) { return ""; }
   getConfig() { return "" }
}

export class StubResourceService {
    getResources(filterSet: FilterSet): Observable<Resource[]> {
        return from([]);
    }
}

@Component({
    selector: 'hero-card',
    template: ''
})
export class StubHeroCard {
    @Input()
    resource: Resource;
}


@NgModule({
    declarations: [
        StubFilterBar,
        StubResourceCard,
        StubResourceList,
        StripHtmlPipe,
        StubHeroCard
    ],
    exports: [
        StubFilterBar,
        StubResourceCard,
        StubResourceList,
        StripHtmlPipe,
        StubHeroCard
    ]
})
export class StubsModule { }