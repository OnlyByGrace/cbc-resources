import { Component, OnInit, Input } from '@angular/core';
import { Resource } from '../Resource';
import { AppConfigService } from '../app.config.service';

@Component({
  selector: 'hero-card',
  templateUrl: './hero-card.component.html',
  styleUrls: ['./hero-card.component.scss']
})
export class HeroCardComponent implements OnInit {
  @Input()
  resource: Resource;

  constructor(private _appConfigService: AppConfigService) { }

  ngOnInit() {
  }

  getAttributeDisplayValue(resource: Resource, attributeName: string) {
    return this._appConfigService.getAttributeDisplayValue(resource, attributeName);
  }
}
