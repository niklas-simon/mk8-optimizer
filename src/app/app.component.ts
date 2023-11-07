import { Component, OnInit } from '@angular/core';
import { Combination, StatsService } from './stats.service';
import { SettingsService } from './settings.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    selection: Combination[] = [];

    constructor() {}

    ngOnInit(): void {}
}
