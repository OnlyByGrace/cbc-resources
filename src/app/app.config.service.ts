import { Injectable } from "@angular/core";
import { FilterSet } from './resource.service';
import { Resource } from './Resource';

@Injectable()
export class AppConfigService {
    private availableFilters: FilterSet;

    loadConfig() {
        let configEl = document.getElementById('resource-config-json');
        if (!configEl) {
            throw "No configuration provided";
        }

        this.availableFilters = JSON.parse(configEl.innerText);
        this.availableFilters[0].currentValue = this.availableFilters[0].possibleAttributeValues[0];
    }

    getConfig() {
        return this.availableFilters;
    }

    getAttributeDisplayValue(resource: Resource, attributeName: string): string {
        if (!resource[attributeName]) return '';
    
        let multiSelectValues = resource[attributeName].split(',');
        let attribute = this.availableFilters
            .find((filter) => filter.Name == attributeName)
            .possibleAttributeValues
            .filter(av => multiSelectValues.some((msv) => av.Value == msv.toLowerCase().replace(/[{}]/g,"")));
    
        return attribute ? attribute.map((a) => a.Display).join(', ') : resource[attributeName];
      }
}