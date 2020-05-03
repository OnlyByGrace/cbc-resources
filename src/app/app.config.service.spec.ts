import { AppConfigService } from "./app.config.service";

describe('App Config Service', () => {
    describe('getConfig', () => {
        it('should return the availableFilters object', () => {
            let appConfigService = new AppConfigService();
            (<any>appConfigService).availableFilters = [ 1, 2, 3 ];
            expect((<any>appConfigService).getConfig()).toEqual([1,2,3]);
        });
    })

    describe('loadConfig', () => {
        it('should load availableFilters from JSON in DOM', () => {
            let sampleFilters = require('./sample-filters.json');

            let el = document.createElement('div');
            el.id = 'resource-config-json';
            el.innerText = JSON.stringify(sampleFilters);
            document.body.append(el);

            let appConfigService = new AppConfigService();
            appConfigService.loadConfig();

            expect(appConfigService.getConfig()).toEqual(sampleFilters);

            el.remove();
        });
    })
});