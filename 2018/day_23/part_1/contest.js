fs = require("fs");

fs.readFile("./2018/day_23/part_1/input.txt", 'utf8', (err, input) => {
    var p = /pos=<(-?\d+),(-?\d+),(-?\d+)>, r=(\d+)/;
    var nanobots = input.split("\r\n").map(s => {
        var [, x, y, z, r] = s.match(p).map(Number);
        return {x, y, z, r};
    });
    var strongest = nanobots.reduce((n1, n2) => n1.r > n2.r ? n1 : n2);
    console.log(nanobots.reduce((acc, n) => Math.abs(n.x - strongest.x) + Math.abs(n.y - strongest.y) + Math.abs(n.z - strongest.z) <= strongest.r ? acc + 1 : acc, 0));
});