fs = require("fs");
fs.readFile("./2020/day_16/input.txt", 'utf8', (err, input) => {

    const regexRules = /^(?<rule>\w+(?:\s\w+)*):\s(?<range1Min>\d+)-(?<range1Max>\d+)\sor\s(?<range2Min>\d+)-(?<range2Max>\d+)$/
    const data = input.split(/\r\n\r\n(?:your|nearby)\sticket(?:s)?:\r\n/);

    const rules = data[0].split('\r\n').reduce((acc, line) => {
        const { rule, ...ranges } = regexRules.exec(line).groups;
        Object.keys(ranges).forEach(key => ranges[key] = Number(ranges[key]));
        acc[rule] = ranges;
        return acc;
    }, {});
    const myTicket = data[1]
        .split(',')
        .map(Number);
    const nearbyTickets = data[2].split('\r\n')
        .map(ticket => ticket
            .split(',')
            .map(Number));

    const allRulesNumbers = Object.keys(rules).reduce((acc, key) => {
        const { range1Min, range1Max, range2Min, range2Max } = rules[key];
        const arr1 = Array.from({ length: 1 + range1Max - range1Min }, (_, i) => range1Min + i);
        const arr2 = Array.from({ length: 1 + range2Max - range2Min }, (_, i) => range2Min + i);
        const generator = function*() { yield* acc, yield* arr1; yield* arr2 };
        return new Set(generator());
    }, new Set());

    const errors = nearbyTickets
        .map(ticket => ticket.filter(n => !allRulesNumbers.has(n)))
        .flat();

    const response = errors.reduce((acc, error) => acc + error, 0);
    console.log(response);
});
