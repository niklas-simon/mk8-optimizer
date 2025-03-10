import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { Driver, Body } from "./constants";

export interface Filter {
    driverClasses: Driver["size"][];
    drivers: number[];
    bodyClasses: Body["type"][];
    bodies: number[];
    tires: number[];
    gliders: number[];
}

export interface Options {
    simplify: boolean;
    specialisation: number;
}

export interface Stat {
    key: string;
    label: string;
    simple?: boolean;
}

export const defaultFilter: Filter = {
    driverClasses: [],
    drivers: [],
    bodyClasses: [],
    bodies: [],
    tires: [],
    gliders: [],
};

export const defaultOptions: Options = {
    simplify: false,
    specialisation: 1,
};

export const defaultStats: Stat[] = [
    {
        key: "mt",
        label: "Mini-Turbo",
    },
    {
        key: "sx",
        label: "Speed",
        simple: true,
    },
    {
        key: "sl",
        label: "Ground Speed",
        simple: false,
    },
    {
        key: "ac",
        label: "Acceleration",
    },
    {
        key: "sg",
        label: "Anti-Gravity Speed",
        simple: false,
    },
    {
        key: "tx",
        label: "Handling",
        simple: true,
    },
    {
        key: "tl",
        label: "Ground Handling",
        simple: false,
    },
    {
        key: "sw",
        label: "Water Speed",
        simple: false,
    },
    {
        key: "sa",
        label: "Air Speed",
        simple: false,
    },
    {
        key: "tg",
        label: "Anti-Gravity Handling",
        simple: false,
    },
    {
        key: "tw",
        label: "Water Handling",
        simple: false,
    },
    {
        key: "ta",
        label: "Air Handling",
        simple: false,
    },
    {
        key: "iv",
        label: "Invincibility",
    },
    {
        key: "of",
        label: "Traction",
    },
    {
        key: "wg",
        label: "Weight",
    },
];

export interface Settings {
    stats: string[];
    filter: Filter;
    options: Options;
}

function get<T>(key: string, defaultValue: T) {
    const store = window.localStorage.getItem(key);

    if (!store) {
        return defaultValue;
    }

    return JSON.parse(store) as T;
}

function save<T>(key: string, value: T) {
    window.localStorage.setItem(key, JSON.stringify(value));
}

export const getStats = () => get("stats", defaultStats);

export const saveStats = (stats: Stat[]) => save("stats", stats);

export const getFilter = () => get("filter", defaultFilter);

export const saveFilter = (filter: Filter) => save("filter", filter);

export const getOptions = () => get("options", defaultOptions);

export const saveOptions = (options: Options) => save("options", options);

export const getOpenGroups = () => get<string[]>("openGroups", []);

export const saveOpenGroups = (openGroups: string[]) =>
    save("openGroups", openGroups);

const getSettingsParam = () => {
    const options = getOptions();
    const stats = getStats()
        .filter(
            (s) =>
                typeof s.simple === "undefined" ||
                s.simple === options.simplify,
        )
        .map((s) => s.key);
    const filter = getFilter();

    return btoa(JSON.stringify({ stats, filter, options } as Settings));
};

export const applySettings = (router: AppRouterInstance) => {
    const url = new URL(window.location.href);

    url.searchParams.keys().forEach((key) => url.searchParams.delete(key));
    url.searchParams.set("settings", getSettingsParam());

    router.push(url.toString());
};
