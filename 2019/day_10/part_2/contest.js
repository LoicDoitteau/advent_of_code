fs = require("fs");
fs.readFile("./2019/day_10/input.txt", 'utf8', (err, data) => {
    const startTime = new Date().getTime();
    let res = null;
    const STOP = 200;
    const DEBUG = false;

    const asteroids = data.split('\r\n').reduce((arr1, row, y) => row.split('').reduce((arr2, col, x) => {
        if(col == '#') arr2.push({x, y});
        return arr2;
    }, arr1), []);

    const los = (a, b) => {
        for (asteroid of asteroids) {
            if(a == asteroid || b == asteroid) continue;

            if(((a.x <= asteroid.x && asteroid.x <= b.x) || (a.x >= asteroid.x && asteroid.x >= b.x)) // asteroid between a & b
            && ((a.y <= asteroid.y && asteroid.y <= b.y) || (a.y >= asteroid.y && asteroid.y >= b.y))) {
                let area = a.x * (asteroid.y - b.y) + asteroid.x * (b.y - a.y) + b.x * (a.y - asteroid.y);
                if(area == 0) return false; // Line
            }
        }
        return true;
    }

    for (let i = 0; i < asteroids.length; i++) {
        const asteroid1 = asteroids[i];
        asteroid1.los = asteroid1.los || 0;
        for (let j = i + 1; j < asteroids.length; j++) {
            const asteroid2 = asteroids[j];
            asteroid2.los = asteroid2.los || 0;
            if(los(asteroid1, asteroid2)) {
                asteroid1.los++;
                asteroid2.los++;
            }
        }
    }

    const station = asteroids.sort((a, b) => b.los - a.los).shift();
    
    const angle = (a, b) => {
        let ang = Math.atan2(b.y - a.y, b.x - a.x) + Math.PI * 0.5;
        return ang < 0 ? ang + Math.PI * 2 : ang; 
    }
    
    asteroids.sort((a, b) => angle(station, a) - angle(station, b));
    let bet = null;
    let vaporizedCount = 0;
    let flag = true;
    while(asteroids.length > 0 && flag) {
        vaporized = [];
        for (let i = 0; i < asteroids.length; i++) {
            const asteroid = asteroids[i];
            if(asteroid == station || asteroid.isVaporized) continue;
            if(los(station, asteroid)) {
                vaporized.push(asteroid);
                if(DEBUG) console.log(`${vaporizedCount + 1} ${asteroid.x},${asteroid.y}`);
                if(++vaporizedCount == STOP) {
                    bet = asteroid;
                    flag = false;
                    break;
                }
            }
        }

        vaporized.forEach(asteroid => {
            var index = asteroids.indexOf(asteroid);
            if (index > -1) asteroids.splice(index, 1);
        });
    }

    res = bet.x * 100 + bet.y;
    console.log(res);
    const elapsedTime = new Date().getTime() - startTime;
    console.log(`Elapsed : ${elapsedTime} ms`);
});
