import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Resource } from '../Resource';
import { AppConfigService } from '../app.config.service';

@Component({
  selector: 'resource-card',
  templateUrl: './resource-card.component.html',
  styleUrls: ['./resource-card.component.scss']
})
export class ResourceCardComponent implements OnInit {
  @Input()
  resource: Resource;

  constructor(private _appConfigService: AppConfigService) { }

  ngOnInit() {
  }

  getAttributeDisplayValue(resource: Resource, attributeName: string) {
    return this._appConfigService.getAttributeDisplayValue(resource, attributeName);
  }
}
