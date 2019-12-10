fs = require("fs");
fs.readFile("./2019/day_10/input.txt", 'utf8', (err, data) => {
    const startTime = new Date().getTime();
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
                    let area = asteroid1.x * (asteroid2.y - asteroid3.y) + asteroid2.x * (asteroid3.y - asteroid1.y) + asteroid3.x * (asteroid1.y - asteroid2.y);
                    if(area == 0) { // line
                        asteroid1.blocked[asteroid3.id] = true;
                        asteroid3.blocked[asteroid1.id] = true;
                        if(DEBUG) console.log(`Line : ${asteroid2.id} blocks ${asteroid1.id} and ${asteroid3.id}`);
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
