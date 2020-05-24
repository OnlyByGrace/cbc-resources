import { Filter, FilterValue } from './resource.service';
import { Resource } from './Resource';

export class Carousel {
    filter: Filter;
    filterValue: FilterValue;
    resources: Resource[];
}