import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Driver, Part, Stat, Body, stats } from '../stats.service';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { MatSliderChange } from '@angular/material/slider';
import { Settings, SettingsService } from '../settings.service';

const STATS = require('../../assets/statistics.json') as {
    drivers: Driver[],
    bodies: Body[],
    tires: Part[],
    gliders: Part[]
};

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
    settings = this.settingsService.get();
    stats = STATS;
    filteredDrivers = STATS.drivers;
    filteredBodies = STATS.bodies;

    constructor(private settingsService: SettingsService) { }

    ngOnInit(): void {
        this.settingsService.getSubject().subscribe(s => this.settings = s);
    }

    change() {
        this.settingsService.set(this.settings);
    }

    drop(e: CdkDragDrop<Stat[]>) {
        moveItemInArray(this.settings.priority, e.previousIndex, e.currentIndex);
        this.change();
    }

    sliderChange(e: MatSliderChange) {
        this.settings.weight = e.value || 0;
        this.change();
    }

    driverClassesChange() {
        this.filteredDrivers = STATS.drivers.filter(driver => !this.settings.driver_classes.length || this.settings.driver_classes.includes(driver.class))
        this.change();
    }

    bodyClassesChange() {
        this.filteredBodies = STATS.bodies.filter(body => !this.settings.driver_classes.length || this.settings.driver_classes.find(c => body.classes.includes(c)));
        this.change();
    }

    simpleChange() {
        this.settings.simple = !this.settings.simple;
        this.settings.priority = stats.filter(p => typeof p.simple === "undefined" || p.simple === this.settings.simple);
        this.change();
    }
}
