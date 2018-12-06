fs = require("fs");
fs.readFile("./2018/day_6/part_1/input.txt", 'utf8', (err, input) => {
    var coords = input.split('\n').map((s, id) => {
        var p = /(\d+), (\d+)/;
        var [, x, y] = s.match(p).map(Number);
        return {id, x, y};
    });
    let min = coords.reduce((o1, o2) => {
        return {x : o1.x < o2.x ? o1.x : o2.x, y : o1.y < o2.y ? o1.y : o2.y};
    });
    let max = coords.reduce((o1, o2) => {
        return {x : o1.x > o2.x ? o1.x : o2.x, y : o1.y > o2.y ? o1.y : o2.y};
    });
    var grid = Array.from({length : max.y - min.y + 1}, _ => Array.from({length : max.x - min.x + 1}));
    for(var x = 0; x < max.x - min.x + 1; x++) {
        for(var y = 0; y < max.y - min.y + 1; y++) {
            grid[y][x] = coords.map(o => {
                return {id : o.id, d : Math.abs(x + min.x - o.x) + Math.abs(y + min.y - o.y)};
            }).reduce((acc, o) => {
                if(o.d < acc.d) return {id : o.id, d : o.d};
                if(o.d == acc.d) return { id : -1, d : o.d};
                return acc;
            }, {d : Infinity});
        };
    };
    var infinities = {};
    for(var x = 0; x < max.x - min.x + 1; x++) { 
        infinities[grid[0][x].id] = true;
        infinities[grid[max.y - min.y][x].id] = true;
    }
    for(var y = 0; y < max.y - min.y + 1; y++) { 
        infinities[grid[y][0].id] = true;
        infinities[grid[y][max.x - min.x].id] = true;
    }
    infinities[-1] = true;
    var closed = grid.reduce((acc1, arr) => {
        return arr.reduce((acc2, o) => {
            if(!infinities[o.id]) {
                if(!acc2[o.id]) acc2[o.id] = 0;
                acc2[o.id]++;
            }
            return acc2;
        }, acc1);
    }, {});
    var r = Object.keys(closed).reduce((acc, k) => {
        return closed[k] > acc ? closed[k] : acc;
    }, 0);
    console.log(r);
});