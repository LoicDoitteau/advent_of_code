fs = require("fs");
fs.readFile("./2020/day_16/input.txt", 'utf8', (err, input) => {

    const regexRules = /^(?<rule>\w+(?:\s\w+)*):\s(?<range1Min>\d+)-(?<range1Max>\d+)\sor\s(?<range2Min>\d+)-(?<range2Max>\d+)$/
    const data = input.split(/\r\n\r\n(?:your|nearby)\sticket(?:s)?:\r\n/);
    const lookingFor = "departure";

    const rules = data[0].split('\r\n').reduce((acc, line) => {
        const { rule, ...ranges } = regexRules.exec(line).groups;
        Object.keys(ranges).forEach(key => ranges[key] = Number(ranges[key]));
        const { range1Min, range1Max, range2Min, range2Max } = ranges;
        const arr1 = Array.from({ length: 1 + range1Max - range1Min }, (_, i) => range1Min + i);
        const arr2 = Array.from({ length: 1 + range2Max - range2Min }, (_, i) => range2Min + i);
        const generator = function*() { yield* arr1; yield* arr2 };
        acc[rule] = new Set(generator());
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
        const generator = function*() { yield* acc, yield* rules[key] };
        return new Set(generator());
    }, new Set());

    const validTickets = nearbyTickets
        .filter(ticket => ticket.every(n => allRulesNumbers.has(n)));

    let possibilities = myTicket.map((_, i) =>
        Object.keys(rules).filter(key =>
            validTickets.every(ticket =>
                rules[key].has(ticket[i])))
    );

    const positions = new Map();
    while (positions.size != myTicket.length) {
        for (var i = 0; i < myTicket.length; i++) {
            const rules = possibilities[i];
            if (rules.length == 1) {
                const rule = rules[0];
                positions.set(rule, i);
                possibilities = possibilities.map(arr => arr.filter(val => val != rule));
                break;
            }
        }
    }

    const departureValues = Object
        .keys(rules)
        .filter(rule => rule.indexOf(lookingFor) == 0)
        .map(rule => myTicket[positions.get(rule)]);

    const response = departureValues.reduce((acc, val) => acc * val, 1);
    console.log(response);
});
