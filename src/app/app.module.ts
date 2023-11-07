import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CombinListComponent } from './combin-list/combin-list.component';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { SettingsComponent } from './settings/settings.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PartComponent } from './part/part.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { StatisticsComponent } from './statistics/statistics.component';
import { ChartComponent } from './chart/chart.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

import Chart from 'chart.js/auto';

@NgModule({
    declarations: [
        AppComponent,
        CombinListComponent,
        SettingsComponent,
        PartComponent,
        StatisticsComponent,
        ChartComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatListModule,
        MatPaginatorModule,
        MatTableModule,
        DragDropModule,
        MatIconModule,
        MatExpansionModule,
        MatSortModule,
        MatCardModule,
        MatSliderModule,
        MatInputModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatCheckboxModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})

export class AppModule {
    constructor() {
        Chart.defaults.borderColor = "#a0a0a0";
        Chart.defaults.color = "#ffffff"
    }
}
