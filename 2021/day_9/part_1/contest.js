fs = require("fs");
fs.readFile("./2021/day_9/input.txt", 'utf8', (err, input) => {
    const map = input.split('\r\n').map(line => line.split('').map(Number));
    part1(map);
});

part1 = (map) => console.log(getLowPoints(map).reduce((acc, value) => acc + value + 1, 0));

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

            flag && lowPoints.push(height);
        }
    }

    return lowPoints;
}
