import { Component } from '@angular/core';
import { Settings, StatsService, defaultSettings } from './stats.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    combins = this.stats.get(defaultSettings);

    constructor(private stats: StatsService) {}

    onSettingsChange(e: Settings) {
        this.combins = this.stats.get(e);
    }
}
