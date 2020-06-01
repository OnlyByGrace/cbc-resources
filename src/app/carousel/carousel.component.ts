import { Component, OnInit, Input } from '@angular/core';
import { Carousel } from '../Carousel';

@Component({
  selector: 'card-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {

  @Input()
  carousel: Carousel;

  constructor() { }

  ngOnInit() {
  }

}
