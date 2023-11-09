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
    stats: {
        key: string,
        value: number
    }[]
}

function getStored() {
    try {
        const str = window.localStorage.getItem("settings");
        if (!str) {
            return null;
        }
        return JSON.parse(str) as Settings;
    } catch (_) {
        return null;
    }
}

@Injectable({
    providedIn: 'root'
})
export class SettingsService {
    settings: Settings = getStored() || {
        priority: stats.filter(s => typeof s.simple === "undefined" || !s.simple),
        simple: false,
        weight: 1.8,
        driver_classes: [],
        body_classes: [],
        drivers: [],
        bodies: [],
        tires: [],
        gliders: [],
        stats: []
    };

    subject = new ReplaySubject<Settings>(1);

    constructor() {
        this.subject.next(this.settings);
    }

    get() {
        return this.settings;
    }

    getSubject() {
        return this.subject;
    }

    set(settings: Settings) {
        this.settings = settings;
        window.localStorage.setItem("settings", JSON.stringify(settings));
        this.subject.next(this.settings);
    }
}
