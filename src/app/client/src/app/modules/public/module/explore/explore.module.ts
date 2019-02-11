import { ExploreRoutingModule } from './explore-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExploreContentComponent} from './components';
import { TelemetryModule } from '@sunbird/telemetry';
import { CoreModule } from '@sunbird/core';
import { SharedModule } from '@sunbird/shared';
import { NgInviewModule } from 'angular-inport';
import { ExploreComponent } from './components/explore/explore.component';
import {SharedFeatureModule} from '@sunbird/shared-feature';
import { SuiModule } from 'ng2-semantic-ui';
import { CatalogComponent } from './components/catalog/catalog.component';
import { CatalogFiltersComponent } from './components/catalog-filters/catalog-filters.component';
import { SignupModule } from '../signup';
@NgModule({
  imports: [
    CommonModule,
    TelemetryModule,
    CoreModule,
    SharedModule,
    NgInviewModule,
    ExploreRoutingModule,
    SharedFeatureModule,
    SuiModule,
    SignupModule
  ],
  declarations: [ ExploreContentComponent, ExploreComponent, CatalogComponent, CatalogFiltersComponent],
  exports: [CatalogComponent, CatalogFiltersComponent]
})
export class ExploreModule { }
