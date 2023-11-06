const combinations = [];

STATS.drivers.forEach(driver => {
    driver.sp = (driver.sl + driver.sw + driver.sa + driver.sg) / 4;
    driver.hn = (driver.tl + driver.tw + driver.ta + driver.tg) / 4;
    driver.tr = (driver.on + driver.of) / 2;
    STATS.bodies.forEach(body => {
        body.sp = (body.sl + body.sw + body.sa + body.sg) / 4;
        body.hn = (body.tl + body.tw + body.ta + body.tg) / 4;
        body.tr = (body.on + body.of) / 2;
        STATS.tires.forEach(tire => {
            tire.sp = (tire.sl + tire.sw + tire.sa + tire.sg) / 4;
            tire.hn = (tire.tl + tire.tw + tire.ta + tire.tg) / 4;
            tire.tr = (tire.on + tire.of) / 2;
            STATS.gliders.forEach(glider => {
                glider.sp = (glider.sl + glider.sw + glider.sa + glider.sg) / 4;
                glider.hn = (glider.tl + glider.tw + glider.ta + glider.tg) / 4;
                glider.tr = (glider.on + glider.of) / 2;
                const combin = {
                    driver: {
                        names: driver.names,
                        images: driver.images,
                        class: driver.class
                    },
                    body: {
                        names: body.names,
                        images: body.images,
                        classes: body.classes
                    },
                    tire: {
                        names: tire.names,
                        images: tire.images
                    },
                    glider: {
                        names: glider.names,
                        images: glider.images
                    }
                };
                Object.keys(driver).filter(key => key.length === 2).forEach(key => combin[key] = driver[key] + body[key] + tire[key] + glider[key]);
                combinations.push(combin);
            })
        })
    })
})

console.log(STATS);

combinations
