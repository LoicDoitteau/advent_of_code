fs = require("fs");
fs.readFile("./2018/day_1/part_2/input.txt", 'utf8', (err, input) => {
    var n = input.split('\n').map(a => parseInt(a));
    var f = 0;
    var m = {};
    var i = 0;
    do {
        m[f] = true;
        f += n[i];
        i = (i + 1) % n.length;
    } while(!m[f])
    console.log(f);
});