fs = require("fs");
fs.readFile("./2021/day_1/input.txt", 'utf8', (err, input) => {
    const measures = input.split('\r\n').map(Number);
    part1(measures);
    part2(measures, 3);
});

const part1 = (measures) => {
    let increases = 0;
    for (let i = 1; i < measures.length; i++) {
        const previous = measures[i-1];
        const current = measures[i];
        current > previous && increases++;
    }
    console.log(increases);
};

const part2 = (measures, window) => {
    let increases = 0;
    for (let i = window; i < measures.length; i++) {
        const previous = measures[i - window];
        const current = measures[i];
        current > previous && increases++;
    }
    console.log(increases);
};
