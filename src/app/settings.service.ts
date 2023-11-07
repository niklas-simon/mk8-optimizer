import { Injectable } from '@angular/core';
import { Driver, Part, Stat, stats, Body } from './stats.service';
import { ReplaySubject } from 'rxjs';

export interface Settings {
    priority: Stat[];
    simple: boolean;
    weight: number;
    driver_classes: string[];
    body_classes: string[];
    drivers: Driver[];
    bodies: Body[];
    tires: Part[];
    gliders: Part[];
}

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    settings: Settings = {
        priority: stats.filter(s => typeof s.simple === "undefined" || !s.simple),
        simple: false,
        weight: 1.8,
        driver_classes: [],
        body_classes: [],
        drivers: [],
        bodies: [],
        tires: [],
        gliders: []
    };

    subject = new ReplaySubject<Settings>();

    constructor() { }

    get() {
        return this.settings;
    }  

    getSubject() {
        return this.subject;
    }

    set(settings: Settings) {
        this.settings = settings;
        this.subject.next(this.settings);
    }
}
