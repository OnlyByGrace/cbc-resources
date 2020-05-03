import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'resource-card',
  templateUrl: './resource-card.component.html',
  styleUrls: ['./resource-card.component.scss']
})
export class ResourceCardComponent implements OnInit {
  @Input()
  title: string;
  @Input()
  date: string;
  @Input()
  topic: string;
  @Input()
  author: string;
  @Input()
  type: string;

  constructor() { }

  ngOnInit() {
  }

}
