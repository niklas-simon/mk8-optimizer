import { HTMLElement, parse } from "node-html-parser";

import {
    PartsCollection,
    Combination,
    Avatar,
    Body,
    Driver,
    Part,
    Tire,
    Glider,
    Stats,
} from "./constants";
import { Options, Settings } from "./settings";

interface Cache extends PartsCollection {
    combinations: Combination[];
    lastFetched: Date;
}

const url = new URL(
    "https://www.mariowiki.com/Mario_Kart_8_Deluxe_in-game_statistics",
);

let cache: Cache | null = null;

export function isCached() {
    return (
        cache && new Date().getTime() - cache.lastFetched.getTime() < 86_400_000
    );
}

function parseStat(col: HTMLElement) {
    return Number(col.text);
}

function parseStats(cols: HTMLElement[]): Stats | null {
    if (cols.length < 14) {
        return null;
    }

    const stats = {
        groundSpeed: parseStat(cols[0]),
        waterSpeed: parseStat(cols[1]),
        airSpeed: parseStat(cols[2]),
        antiGravSpeed: parseStat(cols[3]),
        speed: 0,
        acceleration: parseStat(cols[4]),
        weight: parseStat(cols[5]),
        groundHandling: parseStat(cols[6]),
        waterHandling: parseStat(cols[7]),
        airHandling: parseStat(cols[8]),
        antiGravHandling: parseStat(cols[9]),
        handling: 0,
        traction: parseStat(cols[10]),
        miniTourbo: parseStat(cols[11]),
        invincibility: parseStat(cols[12]),
    } satisfies Stats;

    stats.speed =
        (stats.groundSpeed +
            stats.waterSpeed +
            stats.airSpeed +
            stats.antiGravSpeed) /
        4;
    stats.handling =
        (stats.groundHandling +
            stats.waterHandling +
            stats.airHandling +
            stats.antiGravHandling) /
        4;

    return stats;
}

function parseAvatars(col: HTMLElement): Avatar[] {
    return col
        .querySelectorAll("a")
        .map((link) => {
            const img = link.querySelector("img");
            const image = img?.getAttribute("src");
            const name = img?.getAttribute("alt");

            if (!image || !name) {
                return null;
            }

            return { image, name };
        })
        .filter((avatar) => avatar !== null);
}

function parseDrivers(table: HTMLElement) {
    const rows = table.querySelectorAll("tbody > tr").slice(3);
    const sizes = rows
        .map((row, i) => ({ ths: row.querySelectorAll("th"), index: i }))
        .filter((ths) => ths.ths.length == 2)
        .map((ths) => ({
            text: ths.ths[0].text.trim(),
            index: ths.index,
        }));

    return rows
        .map((row, i) => {
            const avatarCol = row.querySelectorAll("th").findLast(() => true);
            const stats = parseStats(row.querySelectorAll("td"));
            const size = sizes.findLast((size) => size.index <= i);

            if (!avatarCol || !size || !stats) {
                return null;
            }

            return {
                avatars: parseAvatars(avatarCol),
                size: size.text as Driver["size"],
                stats,
                id: i,
            } satisfies Driver;
        })
        .filter((driver) => driver !== null)
        .reduce((map, driver) => {
            map.set(driver.id, driver);

            return map;
        }, new Map<number, Driver>());
}

function parseBodies(table: HTMLElement) {
    const rows = table.querySelectorAll("tbody > tr").slice(3);

    return rows
        .map((row, i) => {
            const cols = row.querySelectorAll("td");

            if (cols.length !== 16) {
                return null;
            }

            const type = cols[1].querySelector("a")?.getAttribute("title");
            const stats = parseStats(cols.slice(2));

            if (!type || !stats) {
                return null;
            }

            return {
                avatars: parseAvatars(cols[0]),
                type: type as Body["type"],
                stats,
                id: i,
            } satisfies Body;
        })
        .filter((body) => body !== null)
        .reduce((map, body) => {
            map.set(body.id, body);

            return map;
        }, new Map<number, Body>());
}

function parseParts<T extends Part>(table: HTMLElement): Map<number, T> {
    const rows = table.querySelectorAll("tbody > tr").slice(3);

    return rows
        .map((row, i) => {
            const cols = row.querySelectorAll("td");

            if (cols.length !== 15) {
                return null;
            }

            const stats = parseStats(cols.slice(1));

            if (!stats) {
                return null;
            }

            return {
                avatars: parseAvatars(cols[0]),
                stats,
                id: i,
            } satisfies Part;
        })
        .filter((body) => body !== null)
        .reduce((map, part) => {
            map.set(part.id, part as T);

            return map;
        }, new Map<number, T>());
}

async function fetchData() {
    const siteHtml = await (await fetch(url)).text();
    const site = parse(siteHtml);

    let drivers: Map<number, Driver> | null = null;
    let bodies: Map<number, Body> | null = null;
    let tires: Map<number, Tire> | null = null;
    let gliders: Map<number, Glider> | null = null;

    site.querySelectorAll("table").forEach((table) => {
        const header = table.querySelector("tbody > tr:first-child");

        if (header?.text.includes("Drivers")) {
            drivers = parseDrivers(table);
        } else if (header?.text.includes("Bodies")) {
            bodies = parseBodies(table);
        } else if (header?.text.includes("Tires")) {
            tires = parseParts(table);
        } else if (header?.text.includes("Gliders")) {
            gliders = parseParts(table);
        }
    });

    if (!drivers || !bodies || !tires || !gliders) {
        throw new Error("not all part types could be parsed");
    }

    const combinations = Array.from(
        (drivers as Map<number, Driver>).values(),
    ).reduce((combinations, driver) => {
        combinations.push(
            ...Array.from(bodies!.values()).reduce((combinations, body) => {
                combinations.push(
                    ...Array.from(tires!.values()).reduce(
                        (combinations, tire) => {
                            combinations.push(
                                ...Array.from(gliders!.values()).reduce(
                                    (combinations, glider) => {
                                        combinations.push({
                                            body,
                                            driver,
                                            glider,
                                            tire,
                                            stats: Object.keys(
                                                body.stats,
                                            ).reduce(
                                                (obj, key) => {
                                                    obj[key] = [
                                                        body,
                                                        driver,
                                                        glider,
                                                        tire,
                                                    ].reduce((sum, part) => {
                                                        return (
                                                            sum +
                                                            (part.stats as any)[
                                                                key
                                                            ]
                                                        );
                                                    }, 0);

                                                    return obj;
                                                },
                                                {} as { [key: string]: number },
                                            ) as unknown as Stats,
                                        } satisfies Combination);

                                        return combinations;
                                    },
                                    [] as Combination[],
                                ),
                            );

                            return combinations;
                        },
                        [] as Combination[],
                    ),
                );

                return combinations;
            }, [] as Combination[]),
        );

        return combinations;
    }, [] as Combination[]);

    cache = {
        combinations,
        drivers,
        bodies,
        tires,
        gliders,
        lastFetched: new Date(),
    };

    return cache;
}

function getCache() {
    if (isCached()) {
        return Promise.resolve(cache!);
    }

    return fetchData();
}

export default async function getCombinations() {
    return (await getCache()).combinations;
}

export async function getDrivers() {
    return (await getCache()).drivers;
}

export async function getBodies() {
    return (await getCache()).bodies;
}

export async function getTires() {
    return (await getCache()).tires;
}

export async function getGliders() {
    return (await getCache()).gliders;
}

export async function getParts() {
    const cache = await getCache();

    return {
        drivers: cache.drivers,
        bodies: cache.bodies,
        tires: cache.tires,
        gliders: cache.gliders,
    };
}

export function getStat(combination: Combination, stat: string) {
    switch (stat) {
        case "sl":
            return combination.stats.groundSpeed;
        case "sw":
            return combination.stats.waterSpeed;
        case "sa":
            return combination.stats.airSpeed;
        case "sg":
            return combination.stats.antiGravSpeed;
        case "sx":
            return combination.stats.speed;
        case "ac":
            return combination.stats.acceleration;
        case "wg":
            return combination.stats.weight;
        case "tl":
            return combination.stats.groundHandling;
        case "tw":
            return combination.stats.waterHandling;
        case "ta":
            return combination.stats.airHandling;
        case "tg":
            return combination.stats.antiGravHandling;
        case "tx":
            return combination.stats.handling;
        case "of":
            return combination.stats.traction;
        case "mt":
            return combination.stats.miniTourbo;
        case "iv":
            return combination.stats.invincibility;
        default:
            return 0;
    }
}

class StatRecord extends Map<number, StatNode> {}

interface StatNode {
    stat: string;
    max: number;
    next: StatRecord | Combination;
    leaf?: boolean;
}

function findPlaceInSplit(
    node: StatNode,
    combination: Combination,
    order: string[],
    index: number,
) {
    const stat = getStat(combination, order[index]);

    if (stat > node.max) {
        node.max = stat;
    }

    if (index >= order.length - 1) {
        node.next = combination;
        node.leaf = true;

        return node;
    }

    const map = node.next as StatRecord;

    let nextSplit = map.get(stat);

    if (!nextSplit) {
        nextSplit = {
            stat: order[index + 1],
            max: 0,
            next: new StatRecord(),
        };
    }

    map.set(stat, findPlaceInSplit(nextSplit, combination, order, index + 1));

    return node;
}

function findOptimalCombinations(node: StatNode, options: Options) {
    if (node.leaf) {
        return [node.next as Combination];
    }

    const map = node.next as StatRecord;
    const statValues = Array.from(map.keys()).sort((a, b) => b - a);

    if (statValues.length === 0) {
        return [];
    }

    if (statValues.length === 1) {
        return findOptimalCombinations(map.get(statValues[0])!, options);
    }

    const combinations: Combination[] = [];

    for (let i = 0; i < statValues.length - 1; i++) {
        const thisValue = statValues[i];
        const nextValue = statValues[i + 1];
        const thisNode = map.get(thisValue)!;
        const nextNode = map.get(nextValue)!;

        const differences = {
            thisStat: thisValue - nextValue, // decreases
            nextStat: nextNode.max - thisNode.max, // increases
        };

        if (
            differences.nextStat / differences.thisStat >
            options.specialisation
        ) {
            // for one point of thisStat, nextStat increased by at least (specialization + 1) -> not yet optimal
            continue;
        }
        if (
            differences.nextStat / differences.thisStat ===
            options.specialisation
        ) {
            // optimal
            combinations.push(...findOptimalCombinations(thisNode, options));
            continue;
        }
        if (
            differences.nextStat / differences.thisStat <
            options.specialisation
        ) {
            // end of optimal values (this one still is)
            combinations.push(...findOptimalCombinations(thisNode, options));
            break;
        }
    }

    return combinations;
}

export async function getOptimized(settings: Settings) {
    let combinations = await getCombinations();

    combinations = combinations.filter((combination) => {
        if (
            settings.filter.driverClasses.length > 0 &&
            !settings.filter.driverClasses.includes(combination.driver.size)
        ) {
            return false;
        }
        if (
            settings.filter.bodyClasses.length > 0 &&
            !settings.filter.bodyClasses.includes(combination.body.type)
        ) {
            return false;
        }
        if (
            settings.filter.drivers.length > 0 &&
            !settings.filter.drivers.includes(combination.driver.id)
        ) {
            return false;
        }
        if (
            settings.filter.bodies.length > 0 &&
            !settings.filter.bodies.includes(combination.body.id)
        ) {
            return false;
        }
        if (
            settings.filter.tires.length > 0 &&
            !settings.filter.tires.includes(combination.tire.id)
        ) {
            return false;
        }
        if (
            settings.filter.gliders.length > 0 &&
            !settings.filter.gliders.includes(combination.glider.id)
        ) {
            return false;
        }

        return true;
    });

    const statTree = combinations.reduce(
        (node: StatNode, combination) => {
            node = findPlaceInSplit(node, combination, settings.stats, 0);

            return node;
        },
        {
            stat: settings.stats[0],
            max: 0,
            next: new StatRecord(),
        },
    );

    const optimalCombinations = findOptimalCombinations(
        statTree,
        settings.options,
    );

    const sortedCombinations = optimalCombinations.sort((a, b) => {
        for (let i = 0; i < settings.stats.length; i++) {
            const sA = getStat(a, settings.stats[i]);
            const sB = getStat(b, settings.stats[i]);

            if (sA !== sB) {
                return sB - sA;
            }
        }

        return 0;
    });

    return sortedCombinations;
}
