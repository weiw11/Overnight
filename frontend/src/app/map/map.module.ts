import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { MapViewComponent } from './map-view/map-view.component';
import { MapPageComponent } from './map-page/map-page.component';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [{ path: '', component: MapPageComponent }];

@NgModule({
  declarations: [
    MapViewComponent,
    MapPageComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ]
})
export class MapModule { }
