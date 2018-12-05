fs = require("fs");
fs.readFile("./2018/day_2/part_1/input.txt", 'utf8', (err, input) => {
    var r = input.split('\n').map(s => { 
        return Array.from(s).reduce((acc, c) => {
            acc[c] = !acc[c] ? 1 : acc[c] + 1;
            return acc;
        }, {});
    }).map(o => {
        return Object.keys(o).reduce((acc, k) => {
            if(o[k] == 2) acc.two = true;
            if(o[k] == 3) acc.three = true;
            return acc;
        }, {two : false, three : false});
    }).reduce((acc, o) => {
        if(o.two) acc.two++;
        if(o.three) acc.three++; 
        return acc;
    }, {two : 0, three : 0});
    console.log(r.two * r.three);
});