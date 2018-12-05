fs = require("fs");
fs.readFile("./2018/day_3/part_1/input.txt", 'utf8', (err, input) => {
    var r = input.split('\n').reduce((acc, s) => {
        var p = /#\d+ @ (\d+),(\d+): (\d+)x(\d+)/;
        var [, x, y, w, h] = s.match(p).map(Number);
        for(var i = 0; i < w; i++) {
            for(var j = 0; j < h; j++) {
                if(!acc[x + i]) acc[x + i] = [];
                if(!acc[x + i][y + j]) acc[x + i][y + j] = 0;
                acc[x + i][y + j]++;
            }
        }
        return acc;
    }, []).reduce((acc1, c) => {
        return acc1 + c.reduce((acc2, n) => {
            return n > 1 ? acc2 + 1 : acc2;
        }, 0);
    }, 0);
    console.log(r);
});