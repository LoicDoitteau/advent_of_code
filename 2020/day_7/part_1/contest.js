fs = require("fs");
fs.readFile("./2020/day_7/input.txt", 'utf8', (err, input) => {
    
    const containerReg = /(?<container>\w+ \w+) bags/
    const containedReg = /\d (?<contained>\w+ \w+) bags?/
    const containerSep = 'contain ';
    const containedSep = ', ';
    const notContainedStr = 'no other bags.'
    const myBag = 'shiny gold';

    const bags = input.split("\r\n").reduce((acc, line) => {
        const [containerStr, containedStr] = line.split(containerSep);
        const container = containerReg.exec(containerStr).groups.container;
        if (containedStr != notContainedStr) {
            const contained = containedStr.split(containedSep).map(s => containedReg.exec(s).groups.contained);
            for (const bag of contained) {
                if(!acc[bag]) acc[bag] = [];
                acc[bag].push(container);
            }
        }
        return acc;
    }, {});

    const getContainerBags = containedBag => {
        const set = new Set();
        const f = containedBag => {
            const bag = bags[containedBag];
            if (!bag) return;
            for (const containerBag of bag) {
                if (!set.has(containerBag)) {
                    set.add(containerBag);
                    f(containerBag, set);
                }
            };
        };
        f(containedBag);
        return set;
    };

    const set = getContainerBags(myBag);
    const response = set.size;

    console.log(response);
});
