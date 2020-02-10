import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FilterBarComponent } from './filter-bar/filter-bar.component';
import { ResourceListComponent } from './resource-list/resource-list.component';
import { ResourceCardComponent } from './resource-card/resource-card.component';
import { ResourceComponent } from './resource/resource.component';

@NgModule({
  declarations: [
    AppComponent,
    FilterBarComponent,
    ResourceListComponent,
    ResourceCardComponent,
    ResourceComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
