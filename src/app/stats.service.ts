import { Injectable } from '@angular/core';

export interface Part {
    names: string[],
    images: string[]
}

export interface Driver extends Part {
    class: string
}

export interface Body extends Part {
    classes: string[]
}

export interface Combination {
    driver: Driver,
    body: Body,
    tire: Part,
    glider: Part,
    wg: number,
    ac: number,
    on: number,
    of: number,
    mt: number,
    sl: number,
    sw: number,
    sa: number,
    sg: number,
    tl: number,
    tw: number,
    ta: number,
    tg: number,
    iv: number,
    score?: number
}

export interface Stat {
    key: string,
    name: string,
    simple?: boolean
}

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

export const stats: Stat[] = [
    {
        key: "mt",
        name: "Mini-Turbo"
    },
    {
        key: "sp",
        name: "Speed",
        simple: true
    },
    {
        key: "sl",
        name: "Ground Speed",
        simple: false
    },
    {
        key: "sa",
        name: "Anti-Gravity Speed",
        simple: false
    },
    {
        key: "ac",
        name: "Acceleration"
    },
    {
        key: "iv",
        name: "Invincibility"
    },
    {
        key: "sw",
        name: "Water Speed",
        simple: false
    },
    {
        key: "sg",
        name: "Air Speed",
        simple: false
    },
    {
        key: "hn",
        name: "Handling",
        simple: true
    },
    {
        key: "tl",
        name: "Ground Handling",
        simple: false
    },
    {
        key: "tr",
        name: "Traction",
        simple: true
    },
    {
        key: "on",
        name: "On-Road Traction",
        simple: false
    },
    {
        key: "of",
        name: "Off-Road Traction",
        simple: false
    },
    {
        key: "tw",
        name: "Water Handling",
        simple: false
    },
    {
        key: "ta",
        name: "Anti-Gravity Handling",
        simple: false
    },
    {
        key: "tg",
        name: "Air Handling",
        simple: false
    },
    {
        key: "wg",
        name: "Weight"
    }
]

export const defaultSettings: Settings = {
    priority: stats.filter(s => typeof s.simple === "undefined" || !s.simple),
    simple: false,
    weight: 1.8,
    driver_classes: [],
    body_classes: [],
    drivers: [],
    bodies: [],
    tires: [],
    gliders: []
}

const COMBINS = require('../assets/combinations.json') as Combination[];

@Injectable({
    providedIn: 'root'
})
export class StatsService {

    constructor() { }

    get(settings: Settings): Combination[] {
        return COMBINS
            .filter(combin => !settings.driver_classes.length || settings.driver_classes.includes(combin.driver.class))
            .filter(combin => !settings.body_classes.length || settings.body_classes.find(c => combin.body.classes.includes(c)))
            .filter(combin => !settings.drivers.length || settings.drivers.find(d => combin.driver.names[0] === d.names[0]))
            .filter(combin => !settings.bodies.length || settings.bodies.find(d => combin.body.names[0] === d.names[0]))
            .filter(combin => !settings.tires.length || settings.tires.find(d => combin.tire.names[0] === d.names[0]))
            .filter(combin => !settings.gliders.length || settings.gliders.find(d => combin.glider.names[0] === d.names[0]))
            .map(combin => {
                let score = 0;
                settings.priority.forEach((stat, i) => {
                    //score += (combin as any)[stat.key] / Math.pow(Math.E, settings.weight * i);
                    //score += (combin as any)[stat.key] / Math.log(settings.weight * i + Math.E / 2);
                    score += (combin as any)[stat.key] * Math.pow(settings.weight, -i);
                }, 0);
                combin.score = score;
                return combin;
            })
            .sort((a, b) => (b.score || 0) - (a.score || 0));
    }
}
