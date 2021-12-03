fs = require("fs");
fs.readFile("./2021/day_3/input.txt", 'utf8', (err, input) => {
    const report = input.split('\r\n').map(line => line.split('').map(Number));
    part1(report);
});

const part1 = (report) => {
    const treshold = report.length >> 1;
    const mask = Array.from(report[0], _ => 1).reduce((acc, val) => (acc << 1) | val, 0);

    const sums = report.reduce((r1, r2) => r1.map((val, i) => val + r2[i]));
    const gammaRate = sums.reduce((acc, val) => (acc << 1) | (val < treshold ? 0 : 1), 0);
    const epsilonRate = ~gammaRate & mask;

    console.log(gammaRate * epsilonRate);
};
