fs = require("fs");
fs.readFile("./2021/day_3/input.txt", 'utf8', (err, input) => {
    const report = input.split('\r\n').map(line => line.split('').map(Number));
    part2(report);
});

const part2 = (report) => console.log(getOxygenGeneratorRating(report) * getCO2ScrubberRating(report));

const getRating = (report, index, predicate) => {
    if (report.length == 1) return report[0].reduce((acc, val) => (acc << 1) | val, 0);
    const treshold = report.length * 0.5;

    const sum = report.reduce((acc, bits) => acc + bits[index], 0);
    const bit = sum >= treshold;

    const filtered = report.filter(bits => predicate(bits[index], bit));

    return getRating(filtered, index + 1, predicate);
};

const getOxygenGeneratorRating = (report) => getRating(report, 0, (b1, b2) => b1 == b2);
const getCO2ScrubberRating = (report) => getRating(report, 0, (b1, b2) => b1 != b2);
