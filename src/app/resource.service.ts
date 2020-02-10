import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Resource } from './Resource';

import * as samples from './sample-resources.json';
import { startWith, distinct, reduce, map, toArray } from 'rxjs/operators';

export enum FILTER_TYPES {
  TYPE,
  AUTHOR,
  SERIES,
  DATE,
  SCRIPTURE,
  TOPIC,
  SEARCH
}

export interface FilterValue {
  startValue: string;
  endValue?: string;
  displayName: string;

  default?: boolean;
  featured?: boolean;
}

export interface Filter {
  type: FILTER_TYPES;
  name: string;
  queryParameter: string;

  possibleValues?: Observable<FilterValue[]>;
  currentValue?: FilterValue;
}

var scriptureSortFunction = (a: FilterValue, b: FilterValue) => {
  var books = [
    'Matthew',
    'Mark',
    'Luke',
    'John',
    'Acts',
    'Romans',
    '1 Corinthians',
    '2 Corinthians',
    'Galatians',
    'Ephesians',
    'Philippians',
    'Colossians',
    '1 Thessalonians',
    '2 Thessalonians',
    '1 Timothy',
    '2 Timothy',
    'Titus',
    'Philemon',
    'Hebrews',
    'James',
    '1 Peter',
    '2 Peter',
    '1 John',
    '2 John',
    '3 John',
    'Jude',
    'Revelation'
  ]

  if (!a.startValue) return -1;
  if (!b.startValue) return 1;
  
  var nameA = books.indexOf(a.displayName); // ignore upper and lowercase
  var nameB = books.indexOf(b.displayName); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  // names must be equal
  return 0;
}

var sortFunction = (a: FilterValue, b: FilterValue) => {
  if (!a.startValue) return -1;
  if (!b.startValue) return 1;
  
  var nameA = a.displayName.toUpperCase(); // ignore upper and lowercase
  var nameB = b.displayName.toUpperCase(); // ignore upper and lowercase
  if (nameA < nameB) {
    return -1;
  }
  if (nameA > nameB) {
    return 1;
  }

  // names must be equal
  return 0;
}

export type FilterSet = Filter[];

const AvailableFilters: FilterSet = [
  {
    type: FILTER_TYPES.TYPE,
    name: "All Types",
    queryParameter: 'type',
    possibleValues: from((<any>samples).default).pipe(
      distinct((item: Resource) => item.type),
      map((item: Resource) => {
        return {
          displayName: item.type,
          startValue: item.type,
        }
      }),
      startWith({
        displayName: "All Types",
        default: true
      }),
      toArray<FilterValue>(),
      map((items) => items.sort(sortFunction))
    ),
    currentValue: {
      displayName: "All Types",
      startValue: undefined
    }
  },
  {
    type: FILTER_TYPES.AUTHOR,
    name: "All Authors",
    queryParameter: 'author',
    possibleValues: from((<any>samples).default).pipe(
      distinct((item: Resource) => item.author),
      map((item: Resource) => {
        return {
          displayName: item.author,
          startValue: item.author,
        }
      }),
      startWith({
        displayName: "All Authors",
        default: true
      }),
      toArray<FilterValue>(),
      map((items) => items.sort(sortFunction))
    )
  },
  {
    type: FILTER_TYPES.DATE,
    name: "All Dates",
    queryParameter: 'datecreated',
    possibleValues: from((<any>samples).default).pipe(
      distinct((item: Resource) => item.date.substr(0, 4)),
      map((item: Resource) => {
        return {
          displayName: item.date.substr(0, 4),
          startValue: item.date.substr(0, 4),
        }
      }),
      startWith({
        displayName: "All Dates",
        default: true
      }),
      toArray<FilterValue>(),
      map((items) => items.sort(sortFunction))
    )
  },
  {
    type: FILTER_TYPES.SCRIPTURE,
    name: "All Scriptures",
    queryParameter: 'passage',
    possibleValues: from((<any>samples).default).pipe(
      distinct((item: Resource) => item.scripture),
      map((item: Resource) => {
        return {
          displayName: item.scripture,
          startValue: item.scripture,
        }
      }),
      startWith({
        displayName: "All Scriptures",
        default: true
      }),
      toArray<FilterValue>(),
      map((items) => items.sort(scriptureSortFunction))
    )
  },
  {
    type: FILTER_TYPES.TOPIC,
    name: "All Topics",
    queryParameter: 'topic',
    possibleValues: from((<any>samples).default).pipe(
      distinct((item: Resource) => item.topic),
      map((item: Resource) => {
        return {
          displayName: item.topic,
          startValue: item.topic,
        }
      }),
      startWith({
        displayName: "All Topics",
        default: true
      }),
      toArray<FilterValue>(),
      map((items) => items.sort(sortFunction))
    )
  },
  {
    type: FILTER_TYPES.SERIES,
    name: "All Series",
    queryParameter: 'series',
    possibleValues: from((<any>samples).default).pipe(
      distinct((item: Resource) => item.series),
      map((item: Resource) => {
        return {
          displayName: item.series,
          startValue: item.series,
        }
      }),
      startWith({
        displayName: "All Series",
        default: true
      }),
      toArray<FilterValue>(),
      map((items) => items.sort(sortFunction))
    )
  }
]

@Injectable({
  providedIn: 'root'
})
export class ResourceService {

  constructor() { }

  getAvailableFilters(): FilterSet {
    return AvailableFilters;
  }

  getResources(filterSet: FilterSet): Observable<Resource[]> {
    let resources: Resource[] = (<any>samples).default;

    for (let filter of filterSet) {
      if (!filter.currentValue) continue;

      if (!filter.currentValue.startValue) continue;

      switch (filter.type) {
        case FILTER_TYPES.AUTHOR:
          resources = resources.filter((resource) => resource.author == filter.currentValue.startValue);
          break;

        case FILTER_TYPES.DATE:
          resources = resources.filter((resource) => {
            return resource.date.startsWith(filter.currentValue.startValue);
          })
          break;

        case FILTER_TYPES.TYPE:
          resources = resources.filter((resource) => {
            return resource.type == filter.currentValue.startValue;
          })
          break;

        case FILTER_TYPES.SCRIPTURE:
          resources = resources.filter((resource) => {
            return resource.scripture == filter.currentValue.startValue;
          })
          break;

        case FILTER_TYPES.SERIES:
          resources = resources.filter((resource) => {
            return resource.series == filter.currentValue.startValue;
          })
          break;

        case FILTER_TYPES.TOPIC:
          resources = resources.filter((resource) => {
            return resource.topic == filter.currentValue.startValue;
          })
          break;

          case FILTER_TYPES.SEARCH:
            resources = resources.filter((resource) => {
              return resource.author.indexOf(filter.currentValue.startValue) > -1
              || resource.title.indexOf(filter.currentValue.startValue) > -1
              || resource.series.indexOf(filter.currentValue.startValue) > -1
              || resource.topic.indexOf(filter.currentValue.startValue) > -1
              || resource.preview.indexOf(filter.currentValue.startValue) > -1;
            })
            break;
      }
    }

    return from([resources]);
  }
}
