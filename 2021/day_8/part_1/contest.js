fs = require("fs");
fs.readFile("./2021/day_8/input.txt", 'utf8', (err, input) => {
    const entries = input.split('\r\n').map(line => {
        const [input, output] = line.split(' | ');
        return {input: input.split(' '), output: output.split(' ')};
    });
    part1(entries);
});

part1 = (entries) => console.log(entries.reduce(
    (acc, entry) => acc + (
        entry.output.filter(
            signal => signal.length == 2 || signal.length == 3 || signal.length == 4 || signal.length == 7
        ).length),
    0));
