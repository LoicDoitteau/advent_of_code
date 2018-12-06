fs = require("fs");
fs.readFile("./2018/day_6/part_2/input.txt", 'utf8', (err, input) => {
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
    var grid = Array.from({length : max.y - min.y + 1}, (_, y) => Array.from({length : max.x - min.x + 1}, (_, x) => {
        return coords.map(o => {
            return Math.abs(x + min.x - o.x) + Math.abs(y + min.y - o.y);
        }).reduce((n1, n2) => {
            return n1 + n2;
        });
    }));
    var r = grid.reduce((acc1, arr) => {
        return arr.reduce((acc2, n) => {
            return n < 10000 ? acc2 + 1 : acc2;
        }, acc1);
    }, 0)
    console.log(r);
});