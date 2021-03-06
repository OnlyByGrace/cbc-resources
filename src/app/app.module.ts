import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppConfigService } from './app.config.service';
import { FilterBarComponent } from './filter-bar/filter-bar.component';
import { ResourceCardComponent } from './resource-card/resource-card.component';
import { ResourceListComponent } from './resource-list/resource-list.component';
import { ResourceComponent } from './resource/resource.component';
import { StripHtmlPipe } from './strip-html.pipe';
import { HeroCardComponent } from './hero-card/hero-card.component';
import { CarouselComponent } from './carousel/carousel.component';
import { CarouselCardComponent } from './carousel/carousel-card/carousel-card.component';


@NgModule({
  declarations: [
    AppComponent,
    FilterBarComponent,
    ResourceListComponent,
    ResourceCardComponent,
    ResourceComponent,
    StripHtmlPipe,
    HeroCardComponent,
    CarouselComponent,
    CarouselCardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [
    AppConfigService,
    {
    provide: APP_INITIALIZER,
    useFactory: (appConfigService: AppConfigService) => {
       return () => appConfigService.loadConfig();
    },
    multi: true,
    deps: [AppConfigService]
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
