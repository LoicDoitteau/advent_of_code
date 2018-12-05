fs = require("fs");
fs.readFile("./2018/day_3/part_2/input.txt", 'utf8', (err, input) => {
    var claims = input.split('\n').map(s => {
        var p = /#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/;
        var [, id, x, y, w, h] = s.match(p).map(Number);
        return {id, x, y, w, h};
    });
    var r = claims.map((c1, i) => {
        return claims.reduce((acc, c2, j) => {
            if(i == j) return acc;
            if(c1.x + c1.w <= c2.x || c1.x >= c2.x + c2.w || c1.y + c1.h <= c2.y || c1.y >= c2.y + c2.h) return acc;
            return {id : acc.id, v : acc.v + 1};
        }, {id : c1.id, v : 0});
    }).reduce((o1, o2) => {
        return o1.v < o2.v ? o1 : o2;
    }).id;
    console.log(r);
});