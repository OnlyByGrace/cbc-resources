import { Component, OnInit, Input } from '@angular/core';
import { Resource } from 'src/app/Resource';
import { AppConfigService } from 'src/app/app.config.service';

@Component({
  selector: 'carousel-card',
  templateUrl: './carousel-card.component.html',
  styleUrls: ['./carousel-card.component.scss']
})
export class CarouselCardComponent implements OnInit {

  @Input()
  resource: Resource;

  constructor(private _appConfigService: AppConfigService) { }

  ngOnInit() {
  }

  getAttributeDisplayValue(resource, attribute) {
    return this._appConfigService.getAttributeDisplayValue(resource, attribute);
  }

}
