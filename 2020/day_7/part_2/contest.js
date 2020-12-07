fs = require("fs");
fs.readFile("./2020/day_7/input.txt", 'utf8', (err, input) => {
    
    const containerReg = /(?<container>\w+ \w+) bags/
    const containedReg = /(?<count>\d) (?<contained>\w+ \w+) bags?/
    const containerSep = 'contain ';
    const containedSep = ', ';
    const notContainedStr = 'no other bags.'
    const myBag = 'shiny gold';

    const bags = input.split("\r\n").reduce((acc, line) => {
        const [containerStr, containedStr] = line.split(containerSep);
        const container = containerReg.exec(containerStr).groups.container;
        if (containedStr != notContainedStr) {
            acc[container] = containedStr.split(containedSep).map(s => containedReg.exec(s).groups);
        }
        return acc;
    }, {});

    const getContainedBagsCount = (containerBag, count) => {
        const bag = bags[containerBag];
        if (!bag) return 0;
        return bag.reduce((acc, containedBag) => {
            const total = count * Number(containedBag.count);
            return acc + total + getContainedBagsCount(containedBag.contained, total);
        }, 0);
    };

    const response = getContainedBagsCount(myBag, 1);
    console.log(response);
});
