import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FilterBarComponent } from './filter-bar/filter-bar.component';
import { ResourceListComponent } from './resource-list/resource-list.component';
import { ResourceCardComponent } from './resource-card/resource-card.component';

@NgModule({
  declarations: [
    AppComponent,
    FilterBarComponent,
    ResourceListComponent,
    ResourceCardComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
