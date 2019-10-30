fs = require("fs");
fs.readFile("./2017/day_2/input.txt", 'utf8', (err, input) => {
    let r = input
        .split("\r\n")
        .map(row => row
            .match(/\d+/g)
            .map(x => Number(x)))
            .map(row2 => Math.max(...row2) - Math.min(...row2))
        .reduce((acc, x) => acc + x);
    console.log(r);
});