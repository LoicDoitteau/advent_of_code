fs = require("fs");
fs.readFile("./2018/day_1/part_1/input.txt", 'utf8', (err, input) => {
    var r = input.split('\n').reduce((acc, n) => acc + parseInt(n), 0);
    console.log(r);
});