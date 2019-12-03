fs = require("fs");
fs.readFile("./2019/day_3/input.txt", 'utf8', (err, input) => {
    const startTime = new Date().getTime();
    let [wire1, wire2] = input
        .split('\r\n')
        .map(x => x.split(',')
            .map(y => getDirection(y)))
        .map(z => getPotitions(z));

    let res = Infinity;
    for (let x in wire1) {
        for(let y in wire1[x]) {
            if(wire2[x] && wire2[x][y]) {
                let dist = wire1[x][y] + wire2[x][y];
                if(dist < res) res = dist;
            }
        }
    }

    console.log(res);
    const elapsedTime = new Date().getTime() - startTime;
    console.log(`Elapsed : ${elapsedTime} ms`);
});

const dir = {
    U : {dx : 0, dy : -1},
    R : {dx : 1, dy : 0},
    D : {dx : 0, dy : 1},
    L : {dx : -1, dy : 0},
};

function getDirection(s) {
    let [, d, l] = s.match(/(R|U|D|L)(\d+)/);
    return {dir : dir[d], length : Number(l)};
}

function getPotitions(directions) {
    let currentPos = {x : 0, y : 0};
    let steps = 0;
    
    return directions.reduce((obj, d) => {
        for(let i = 0; i < d.length; i++, steps++) {
            const {x, y} = {x : currentPos.x + d.dir.dx, y : currentPos.y + d.dir.dy};
            currentPos = {x, y};
            if(!obj[x]) obj[x] = {};
            if(!obj[x][y]) obj[x][y] = steps + 1;
        }
        return obj;
    }, {});
}

