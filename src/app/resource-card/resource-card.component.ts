import { Component, OnInit, Input, Output } from '@angular/core';
import { EventEmitter } from 'events';

@Component({
  selector: 'resource-card',
  templateUrl: './resource-card.component.html',
  styleUrls: ['./resource-card.component.scss']
})
export class ResourceCardComponent implements OnInit {
  @Input()
  title: string;
  @Input()
  type: string;
  @Input()
  date: string;
  @Input()
  topic: string;
  @Input()
  author: string;

  constructor() { }

  ngOnInit() {
  }

}
