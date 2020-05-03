import { Injectable } from "@angular/core";
import { FilterSet } from './resource.service';

@Injectable()
export class AppConfigService {
    private availableFilters: FilterSet;

    loadConfig() {
        let configEl = document.getElementById('resource-config-json');
        if (!configEl) {
            throw "No configuration provided";
        }

        this.availableFilters = JSON.parse(configEl.innerText);
    }

    getConfig() {
        return this.availableFilters;
    }
}