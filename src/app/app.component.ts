import { Component, OnInit } from '@angular/core';
import { Combination, StatsService } from './stats.service';
import { SettingsService } from './settings.service';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    selection: Combination[] = [];
    isLandscape = false;

    constructor(private breakpointObserver: BreakpointObserver) {}

    ngOnInit(): void {
        this.breakpointObserver.observe('(orientation: landscape)').subscribe(state => {
            this.isLandscape = state.matches;
        })
    }
}
