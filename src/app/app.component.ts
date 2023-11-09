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
    isLandscape?: boolean;

    constructor(private breakpointObserver: BreakpointObserver) {}

    ngOnInit(): void {
        this.breakpointObserver.observe('(orientation: landscape)').subscribe(state => {
            if (typeof this.isLandscape !== "undefined" && this.isLandscape !== state.matches) {
                window.location.reload();
            }
            this.isLandscape = state.matches;
        })
    }
}
