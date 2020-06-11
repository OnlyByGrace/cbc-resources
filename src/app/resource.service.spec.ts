import { TestBed } from '@angular/core/testing';

import { ResourceService } from './resource.service';
import { Resource } from './Resource';
import { from } from 'rxjs';

import { environment } from '../environments/environment';

let sampleResources = require('./sample-resources.json');

describe('ResourceService', () => {
    let mockHttpClient: { get: jasmine.Spy };
    let resourceService: ResourceService;

    beforeEach(() => {
        mockHttpClient = jasmine.createSpyObj('HttpClient', ['get']);

        resourceService = new ResourceService(<any>mockHttpClient);
    });

    it('should be created', () => {
        expect(resourceService).toBeTruthy();
    });

    // it('should return an observable of resources from a FilterSet', () => {
    //   expect(true).toBeFalsy();
    // });


    describe('getResources', () => {
        it('should call get', (done) => {
            mockHttpClient.get.and.returnValue(from([sampleResources]));

            resourceService.getResources([
                {
                    Id: 1,
                    Name: 'Author',
                    currentValue: {
                        Value: '1',
                        Display: 'John Doe'
                    }
                }
            ]).subscribe((resources) => {
                expect(mockHttpClient.get).toHaveBeenCalled();
                expect(resources).toBe(sampleResources);
                done();
            })
        });

        it('should call get with the environment server URL if no search filter', (done) => {
            mockHttpClient.get.and.returnValue(from([sampleResources]));

            resourceService.getResources([]).subscribe((resources) => {
                expect(mockHttpClient.get).toHaveBeenCalledWith(environment.serverUrl + environment.resourceUrl, { params: {} });
                expect(resources).toBe(sampleResources);
                done();
            })
        });

        it('should convert filter with a value selected to URL parameters', () => {
            mockHttpClient.get.and.returnValue(from([sampleResources]));

            resourceService.getResources([
                {
                    Id: 1,
                    Name: 'Author',
                    currentValue: {
                        Value: 'value-of-author',
                        Display: 'John Doe'
                    }
                },
                {
                    Id: 2,
                    Name: 'Passage',
                    currentValue: {
                        Value: 'value-of-passage',
                        Display: 'Genesis'
                    }
                },
                {
                    Id: 3,
                    Name: 'Series'
                }
            ]).subscribe((resources) => {
                expect(mockHttpClient.get).toHaveBeenCalledWith(environment.serverUrl + environment.resourceUrl, { params: { '1': 'value-of-author', '2': 'value-of-passage' } });
                expect(resources).toBe(sampleResources);
            })
        });

        it('should set the terms parameter and seearch url for a search filter', () => {
            mockHttpClient.get.and.returnValue(from([sampleResources]));

            resourceService.getResources([
                {
                    Id: -3,
                    Name: 'Search',
                    currentValue: {
                        Value: 'my-search-term',
                        Display: null
                    }
                }
            ]).subscribe((resources) => {
                expect(mockHttpClient.get).toHaveBeenCalledWith(environment.serverUrl + environment.searchUrl, { params: { 'terms': 'my-search-term' } });
                expect(resources).toBe(sampleResources);
            })
        })
    });
});
