fs = require("fs");
fs.readFile("./2021/day_9/input.txt", 'utf8', (err, input) => {
    const map = input.split('\r\n').map(line => line.split('').map(Number));
    part2(map);
});

part2 = (map) => {
    const [one, two, three] = getBasins(map).map(bassin => bassin.length).sort((a, b) => b - a);
    console.log(one * two * three);
} 

const hash = (x, y) => x << 10 | y;

getBasins = (map) => {
    const basins = [];
    const lowPoints = getLowPoints(map);

    for (const lowPoint of lowPoints) {
        const basin = [lowPoint];
        const toDo = [lowPoint];
        const done = new Set([hash(lowPoint.x, lowPoint.y)]);

        while (toDo.length > 0) {
            const {x, y} = toDo.shift();
            const height = map[y][x];

            const tryAdd = (point) =>
                !done.has(hash(point.x, point.y)) &&
                map[point.y] &&
                map[point.y][point.x] > height &&
                map[point.y][point.x] != 9 &&
                toDo.push(point) &&
                basin.push(point) &&
                done.add(hash(point.x, point.y));

            tryAdd({x, y: y-1}); 
            tryAdd({x, y: y+1}); 
            tryAdd({x: x-1, y}); 
            tryAdd({x: x+1, y}); 
        }

        basins.push(basin);
    }

    return basins;
}

getLowPoints = (map) => {
    const lowPoints = [];

    for (let y = 0; y < map.length; y++) {
        const row = map[y];
        for (let x = 0; x < row.length; x++) {
            const height = row[x];
            let flag = true;

            if (y > 0) {
                const up = map[y-1][x];
                flag = flag && height < up;
            }

            if (y < map.length - 1) {
                const down = map[y+1][x];
                flag = flag && height < down;
            }

            if (x > 0) {
                const left = row[x-1];
                flag = flag && height < left;
            }

            if (x < row.length - 1) {
                const right = row[x+1];
                flag = flag && height < right;
            }

            flag && lowPoints.push({x, y});
        }
    }

    return lowPoints;
}
