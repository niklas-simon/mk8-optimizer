export interface Avatar {
    name: string;
    image: string;
}

export interface Stats {
    groundSpeed: number;
    waterSpeed: number;
    airSpeed: number;
    antiGravSpeed: number;
    speed: number;
    acceleration: number;
    weight: number;
    groundHandling: number;
    waterHandling: number;
    airHandling: number;
    antiGravHandling: number;
    handling: number;
    traction: number;
    miniTourbo: number;
    invincibility: number;
}

export interface Part {
    id: number;
    stats: Stats;
    avatars: Avatar[];
}

export interface Driver extends Part {
    size: "Small" | "Medium" | "Large";
}

export interface Body extends Part {
    type: "Kart" | "Standard Bike" | "Sport Bike" | "All-Terrain Vehicle";
}

export interface Tire extends Part {}

export interface Glider extends Part {}

export interface Combination {
    driver: Driver;
    body: Body;
    tire: Tire;
    glider: Glider;
    stats: Stats;
}

export interface PartsCollection {
    drivers: Map<number, Driver>;
    bodies: Map<number, Body>;
    tires: Map<number, Tire>;
    gliders: Map<number, Glider>;
}
