fs = require("fs");
fs.readFile("./2019/day_10/input.txt", 'utf8', (err, data) => {
    const startTime = new Date().getTime();
    const epsilon = 0.001;
    let res = null;
    const DEBUG = false;

    const asteroids = data.split('\r\n').reduce((arr1, row, y) => row.split('').reduce((arr2, col, x) => {
        if(col == '#') {
            const blocked = {};
            const id = row.length * y + x;
            arr2.push({id, x, y, blocked});
        }
        return arr2;
    }, arr1), []);

    for(let i = 0; i < asteroids.length; i++) {
        const asteroid1 = asteroids[i];
        for(let j = i + 1; j < asteroids.length; j++) {
            const asteroid2 = asteroids[j];
            for(let k = j + 1; k < asteroids.length; k++) {
                const asteroid3 = asteroids[k];
                if(((asteroid1.x <= asteroid2.x && asteroid2.x <= asteroid3.x) || (asteroid1.x >= asteroid2.x && asteroid2.x >= asteroid3.x)) // 2 between 1 & 3
                 && ((asteroid1.y <= asteroid2.y && asteroid2.y <= asteroid3.y) || (asteroid1.y >= asteroid2.y && asteroid2.y >= asteroid3.y))) {
                    let area = a = asteroid1.x * (asteroid2.y - asteroid3.y) + asteroid2.x * (asteroid3.y - asteroid1.y) + asteroid3.x * (asteroid1.y - asteroid2.y);
                    if(area == 0) { // line
                        asteroid1.blocked[asteroid3.id] = true;
                        asteroid3.blocked[asteroid1.id] = true;
                        if(DEBUG) console.log(`Line : ${asteroid2.id} blocks ${asteroid1.id} and ${asteroid3.id}`);
                    }
                    else { // other
                        let d1 = {x : asteroid1.x - asteroid2.x, y : asteroid1.y - asteroid2.y};
                        let d2 = {x : asteroid2.x - asteroid3.x, y : asteroid2.y - asteroid3.y};
                        if((Math.abs(d2.x) + Math.abs(d2.y)) < (Math.abs(d1.x) + Math.abs(d1.y))) [d1, d2] = [d2, d1];

                        const dx = d2.x / d1.x;
                        const dy = d2.y / d1.y;
                        if(Number.isInteger(dx) && Number.isInteger(dy) && dx == dy) {
                            asteroid1.blocked[asteroid3.id] = true;
                            asteroid3.blocked[asteroid1.id] = true;
                            if(DEBUG) console.log(`Other : ${asteroid2.id} blocks ${asteroid1.id} and ${asteroid3.id}`);
                        }
                    }
                }
            }
        }
    }

    res = asteroids.map(a => asteroids.length - 1 - Object.keys(a.blocked).length).sort((a, b) => b - a)[0];
    console.log(res);
    const elapsedTime = new Date().getTime() - startTime;
    console.log(`Elapsed : ${elapsedTime} ms`);
});
